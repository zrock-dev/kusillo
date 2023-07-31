use rusqlite::Connection;
use serde::Serialize;
use tauri::{AppHandle, command};

use crate::database::game_match::actions::{Contenders, insert_into_score, retrieve_contenders, retrieve_latest_game_id, retrieve_score_value};
use crate::database::game_match::contender_actions::{ContenderCreation, ContendersCreation, create_game_row};
use crate::database::game_match::contenders::{retrieve_contenders_value_i64};
use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;
use crate::database::registration::utils::{retrieve_team_value, retrieve_teams, Team};
use crate::errors::Error;
use crate::game_match::actions::{get_score_color, reset_stage, update_game_status, update_team_score, update_team_stage};
use crate::game_match::utils::get_max_score;
use crate::transitions::events::{fire_game_dialog_update_event, fire_stage_dialog_update_event};

#[derive(Serialize)]
pub struct GameInitData {
    pub team_name: String,
    pub score: i64,
    pub score_color: String,
    pub max_score: i64,
}

#[command]
pub fn create_new_game(team_a_id: i64, team_a_color: String, team_b_id: i64, team_b_color: String) -> Result<(), Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;

    let contenders = ContendersCreation {
        team_a: ContenderCreation { id: team_a_id, color: team_a_color },
        team_b: ContenderCreation { id: team_b_id, color: team_b_color },
    };
    create_game_row(&connection, contenders)?;

    Ok(())
}

#[command]
pub fn record_interaction(team_id: i64, game_id: i64, score_points: i64) -> Result<(), Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    let current_stage = retrieve_score_value(&connection, "set_number", &game_id, &team_id)?;
    insert_into_score(&connection, &game_id, &team_id, &score_points, &current_stage)?;
    Ok(())
}

#[command]
pub fn handle_score_update(handle: AppHandle, game_id: i64, team_id: i64, is_up_button: bool) -> Result<(), Error> {
    update_team_score(&handle, team_id, game_id)?;

    match update_team_stage(&handle, team_id, game_id, is_up_button)? {
        Some(stage_payload) => {
            reset_stage(&handle, game_id)?;

            match update_game_status(&handle, game_id)? {
                Some(game_payload) => {
                    fire_game_dialog_update_event(&handle, game_payload)?;
                }

                None => {
                    fire_stage_dialog_update_event(&handle, stage_payload)?;
                }
            }
            Ok(())
        }

        None => {
            Ok(())
        }
    }
}

#[command]
pub fn request_game_init_data(team_id: i64) -> Result<GameInitData, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    let max_score = get_max_score(0);
    let team_id = retrieve_contenders_value_i64(&connection, &team_id, "team_id")?;
    Ok(GameInitData {
        team_name: retrieve_team_value(&connection, "name", &team_id)?,
        score: 0,
        score_color: get_score_color(0),
        max_score,
    })
}

#[command]
pub fn request_latest_contenders() -> Result<Contenders, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    // TODO: game id should be obtained through a function in the DB folder
    let game_id = retrieve_latest_game_id(&connection)?;
    Ok(retrieve_contenders(&connection, &game_id)?)
}


#[command]
pub fn request_teams() -> Result<Vec<Team>, Error> {
    Ok(retrieve_teams()?)
}
