use rusqlite::Connection;
use tauri::AppHandle;
use crate::clock::commands::{reset_clock, stop_clock};
use crate::database::game_match_actions::{cash_team_set, record_winner, retrieve_contenders, retrieve_game_value, retrieve_score_value, update_game_value};
use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;
use crate::database::registration::utils::retrieve_team_value;
use crate::errors::Error;
use crate::game_match::events::{fire_game_won_event, fire_score_update_event, fire_stage_reset_event, fire_stage_update_event, GameUpdatePayload, ScoreUpdatePayload, StageUpdatePayload};
use crate::game_match::utils::{get_max_score, is_stage_won, is_stage_won_on_timeout, review_game};
use crate::transitions::events::{fire_game_dialog_update_event, fire_stage_dialog_update_event, GameDialogPayload, StageDialogPayload};

pub fn get_score_color(score_points: i64) -> String {
    match score_points {
        points if points < 16 => String::from("blue"),
        points if points == 16 => String::from("orange"),
        points if points == 17 => String::from("pink"),
        points if points >= 18 => String::from("red"),
        _ => panic!("Score {} is outside of bounds", score_points)
    }
}

pub fn update_team_score(handle: &AppHandle, team_id: i64, game_id: i64) -> Result<(), Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    let score = retrieve_score_value(&connection, "score_points", &game_id, &team_id)?;
    let score_color = get_score_color(score);

    fire_score_update_event(
        &handle,
        ScoreUpdatePayload {
            team_id,
            score,
            score_color,
        },
    )?;

    Ok(())
}

pub fn update_team_stage(handle: &AppHandle, team_id: i64, game_id: i64, is_up_button: bool) -> Result<bool, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;

    if is_stage_won(&connection, game_id, team_id, is_up_button)? {
        let stage_number = cash_team_set(&connection, &team_id, &game_id)?;
        let game_set = retrieve_game_value(&connection, "set_number", &game_id)?;

        let stage_update_payload = StageUpdatePayload {
            team_id,
            stage_number,
            max_score: get_max_score(game_set),
        };

        let stage_dialog_payload = StageDialogPayload {
            status: true,
            team_name: Some(retrieve_team_value(&connection, "name", &game_set)?),
            game_set: Some(game_set),
        };

        fire_stage_update_event(handle, stage_update_payload)?;
        fire_stage_dialog_update_event(handle, stage_dialog_payload)?;
        return Ok(true);
    }

    Ok(false)
}

pub fn update_game_status(handle: &AppHandle, game_id: i64) -> Result<(), Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    let contenders = retrieve_contenders(&connection, &game_id)?;
    let game_set = retrieve_game_value(&connection, "set_number", &game_id)?;

    if game_set == 1 {
        Ok(())

    }else {
        let contender = review_game(contenders, game_set);
        if contender.is_some() {
            let contender = contender.unwrap();
            let game_update_payload = GameUpdatePayload { winner_name: contender.name.clone() };
            let game_dialog_payload = GameDialogPayload { status: true, winner_name: Some(contender.name.clone())};

            record_winner(&connection, &game_id, &contender.id)?;
            fire_game_won_event(handle, game_update_payload)?;
            fire_game_dialog_update_event(handle, game_dialog_payload)?;
            stop_clock();
        }

        Ok(())
    }
}

pub fn reset_stage(handle: &AppHandle, game_id: i64) -> Result<(), Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    update_game_value(&connection, &game_id, "on_time", 1)?;
    reset_clock();
    fire_stage_reset_event(handle)?;
    Ok(())
}

pub fn update_team_stage_on_timeout(handle: &AppHandle, connection: &Connection, game_id: i64) -> Result<bool, Error> {
    let (team_id, is_stage_won) = is_stage_won_on_timeout(&connection, game_id)?;

    if  is_stage_won{
        let stage_number = cash_team_set(&connection, &team_id, &game_id)?;
        let game_set = retrieve_game_value(&connection, "set_number", &game_id)?;

        let stage_update_payload = StageUpdatePayload {
            team_id,
            stage_number,
            max_score: get_max_score(game_set),
        };
        fire_stage_update_event(handle, stage_update_payload)?;

        Ok(true)
    }else {
        update_game_value(&connection, &game_id, "on_time", 0)?;

        Ok(false)
    }

}
