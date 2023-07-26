use rusqlite::Connection;
use tauri::AppHandle;
use crate::clock::commands::{reset_clock, start_clock};
use crate::database::game_match_actions::{cash_team_set, retrieve_contenders, retrieve_game_value, retrieve_score_value, update_game_value};
use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;
use crate::errors::Error;
use crate::game_match::events::{fire_game_won_event, fire_score_update_event, fire_stage_reset_event, fire_stage_update_event, ScoreUpdatePayload, StageUpdatePayload};
use crate::game_match::utils::{at_three, at_two, attempt_record_winner, get_max_score, is_stage_won, is_stage_won_on_timeout};

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

pub fn update_team_stage(handle: &AppHandle, team_id: i64, game_id: i64) -> Result<bool, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;

    if is_stage_won(&connection, game_id, team_id)? {
        let stage_number = cash_team_set(&connection, &team_id, &game_id)?;
        let game_set = retrieve_game_value(&connection, "set_number", &game_id)?;

        let stage_update_payload = StageUpdatePayload {
            team_id,
            stage_number,
            max_score: get_max_score(game_set),
        };

        fire_stage_update_event(handle, stage_update_payload)?;
        return Ok(true);
    }

    Ok(false)
}

pub fn update_game_status(handle: &AppHandle, game_id: i64) -> Result<(), Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    let contenders = retrieve_contenders(&connection, &game_id)?;

    let game_set = retrieve_game_value(&connection, "set_number", &game_id)?;
    let team_a_set_number = retrieve_score_value(&connection, "set_number", &game_id, &contenders.team_a_id)?;
    let team_b_set_number = retrieve_score_value(&connection, "set_number", &game_id, &contenders.team_b_id)?;

    match game_set {
        1 => Ok(()),
        2 => {
            let help_value = at_two(team_a_set_number, team_b_set_number);
            let successful_attempt = attempt_record_winner(&connection, game_id, help_value)?;
            if successful_attempt {
                fire_game_won_event(handle)?;
            }
            Ok(())
        }
        3 => {
            let help_value = at_three(team_a_set_number, team_b_set_number);
            let successful_attempt = attempt_record_winner(&connection, game_id, help_value)?;
            if successful_attempt {
                fire_game_won_event(handle)?;
            }
            Ok(())
        }
        _ => panic!("Unexpected game set #{}", game_set)
    }
}

pub fn reset_stage(handle: &AppHandle, game_id: i64) -> Result<(), Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    update_game_value(&connection, &game_id, "on_time", 1)?;
    reset_clock();
    start_clock();
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
