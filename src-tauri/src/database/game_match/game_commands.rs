use rusqlite::Connection;

use crate::database::game_match::game_match::{get_max_score, get_score_color, is_game_won, update_stage_number};
use crate::database::game_match::utils::{record_winner, retrieve_contenders, retrieve_game_set, retrieve_score_value};
use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;
use crate::utils::rusqlite_error::Error;

#[derive(serde::Serialize)]
pub struct Contestants {
    pub game_id: i64,
    pub team_a_id: i64,
    pub team_b_id: i64,
}

#[derive(serde::Serialize)]
pub struct Configuration {
    max_score: i64,
    score_color: String,
    current_stage: i64,
    is_game_won: bool,
    is_stage_won: bool,
}

#[tauri::command]
pub fn make_match(team_a_id: i64, team_b_id: i64) -> Result<i64, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;

    connection.execute(
        "INSERT INTO game (team_a_id, team_b_id, set_number) VALUES (?1, ?2, 1)",
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
pub fn record_interaction(set_number: i64, team_id: i64, score_points: i64, game_id: i64) -> Result<(), Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    connection.execute(
        "INSERT INTO
            score (game_id, set_number, score_points, team_id, timestamp)
            VALUES (
                 ?1, ?2, ?3, ?4,
                 (SELECT DATETIME())
            )",
        [game_id, set_number, score_points, team_id],
    )?;

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
pub fn request_configuration(game_id: i64, team_id: i64) -> Result<Configuration, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;

    let score_points = retrieve_score_value(&connection, "score_points", &game_id, &team_id)?;
    let game_set = retrieve_game_set(&connection, &game_id)?;
    let max_score = get_max_score(game_set);

    let is_stage_won = max_score == score_points;
    if is_stage_won {
        update_stage_number(&connection, &team_id, &game_id)?;
    }
    let current_stage = retrieve_score_value(&connection, "set_number", &game_id, &team_id)?;
    let is_game_won = is_game_won(game_id)?;
    if is_game_won {
        record_winner(&connection, &game_id, &team_id)?;
    }

    Ok(Configuration {
        max_score,
        score_color: get_score_color(score_points),
        current_stage,
        is_game_won,
        is_stage_won,
    })
}
