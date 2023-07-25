use rusqlite::Connection;

use crate::database::game_match::game_match::{get_max_score};
use crate::database::game_match::utils::{record_to_score_table, retrieve_contenders, retrieve_game_set, retrieve_score_value};
use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;
use crate::utils::rusqlite_error::Error;

#[derive(serde::Serialize)]
pub struct Contestants {
    pub game_id: i64,
    pub team_a_id: i64,
    pub team_b_id: i64,
}

#[derive(serde::Serialize, Clone)]
pub struct GameUpdate {
    pub score_color: String,
    pub current_stage: i64,
    pub is_game_won: bool,
    pub is_stage_won: bool,
}

#[tauri::command]
pub fn make_match(team_a_id: i64, team_b_id: i64) -> Result<i64, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;

    connection.execute(
        "INSERT INTO game (team_a_id, team_b_id, set_number) VALUES (?1, ?2, 0)",
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

#[tauri::command]
pub fn request_contenders(game_id: i64) -> Result<Contestants, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    Ok(retrieve_contenders(&connection, &game_id)?)
}

#[tauri::command]
pub fn record_interaction(team_id: i64, game_id: i64, score_points: i64) -> Result<(), Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    let current_stage = retrieve_score_value(&connection, "set_number", &game_id, &team_id)?;

    record_to_score_table(&connection, &game_id, &team_id, &score_points, &current_stage)?;
    Ok(())
}

#[tauri::command]
pub fn request_team_name(team_id: i64) -> Result<String, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    let team_name = connection.query_row_and_then(
        "SELECT name FROM teams WHERE rowid = ?1",
        [team_id],
        |row| {
            Ok::<String, Error>(
                row.get(0)?
            )
        },
    )?;

    Ok(team_name)
}

#[tauri::command]
pub fn request_max_score(game_id: i64) -> Result<i64, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    let game_set = retrieve_game_set(&connection, &game_id)?;
    Ok(get_max_score(game_set))
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
