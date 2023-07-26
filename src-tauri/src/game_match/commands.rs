use rusqlite::Connection;
use serde::Serialize;
use tauri::{AppHandle, command};
use crate::database::game_match_actions::{Contestants, insert_into_score, retrieve_contenders, retrieve_score_value};

use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;
use crate::database::registration::utils::retrieve_team_name;
use crate::errors::Error;
use crate::game_match::actions::{get_score_color, reset_stage, update_game_status, update_team_score, update_team_stage};
use crate::game_match::utils::get_max_score;

#[derive(Serialize)]
pub struct GameInitData {
    pub team_name: String,
    pub score: i64,
    pub score_color: String,
    pub max_score: i64,
}

#[command]
pub fn create_new_game(team_a_id: i64, team_b_id: i64) -> Result<i64, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;

    connection.execute(
        "INSERT INTO game (team_a_id, team_b_id, set_number, on_time) VALUES (?1, ?2, 0, 1)",
        [team_a_id, team_b_id])?;

    let game_id = connection.last_insert_rowid();
    connection.execute(
        "INSERT INTO score VALUES(?1, 0, 0, ?2, (SELECT DATETIME()))",
        [game_id, team_a_id],
    )?;
    connection.execute(
        "INSERT INTO score VALUES(?1, 0, 0, ?2, (SELECT DATETIME()))",
        [game_id, team_b_id],
    )?;

    Ok(game_id)
}

#[command]
pub fn request_contenders(game_id: i64) -> Result<Contestants, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    Ok(retrieve_contenders(&connection, &game_id)?)
}

#[command]
pub fn record_interaction(team_id: i64, game_id: i64, score_points: i64) -> Result<(), Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    let current_stage = retrieve_score_value(&connection, "set_number", &game_id, &team_id)?;
    insert_into_score(&connection, &game_id, &team_id, &score_points, &current_stage)?;
    Ok(())
}

#[command]
pub fn handle_score_update(handle: AppHandle, game_id: i64, team_id: i64) -> Result<(), Error> {
    update_team_score(&handle, team_id, game_id)?;

    let is_stage_won = update_team_stage(&handle, team_id, game_id)?;
    if is_stage_won {
        update_game_status(&handle, game_id)?;
        reset_stage(&handle, game_id)?;
    }

    Ok(())
}

#[command]
pub fn request_game_init_data(team_id: i64) -> Result<GameInitData, Error> {
    let max_score = get_max_score(0);
    Ok(GameInitData {
        team_name: retrieve_team_name(team_id)?,
        score: 0,
        score_color: get_score_color(0),
        max_score,
    })
}

#[tauri::command]
pub fn request_latest_contenders() -> Result<Contestants, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    let game_id = connection.query_row_and_then(
        "SELECT rowid FROM game ORDER BY rowid DESC LIMIT 1",
        [],
        |row| {
            Ok::<i64, Error>(
                row.get(0)?
            )
        },
    )?;
    Ok(retrieve_contenders(&connection, &game_id)?)
}
