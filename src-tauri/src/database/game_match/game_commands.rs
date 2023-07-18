use rusqlite::Connection;

use crate::database::game_match::utils::{cash_game_set, get_game_set, get_max_score, get_score_color, get_set_number};
use crate::database::game_match::verifications::{at_three, at_two, verify_help};
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
    is_set_won: bool,
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

    let contestants = connection.query_row_and_then(
        "SELECT rowid, team_a_id, team_b_id FROM game WHERE rowid = ?1",
        [game_id],
        |row| {
            Ok::<Contestants, Error>(Contestants {
                game_id: row.get(0)?,
                team_a_id: row.get(1)?,
                team_b_id: row.get(2)?,
            })
        },
    )?;

    Ok(contestants)
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
pub fn request_configuration(game_id: i64, score_points: i64) -> Result<Configuration, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    let game_set = get_game_set(&connection, &game_id)?;
    let max_score = get_max_score(game_set);

    Ok(
        Configuration {
            max_score,
            score_color: get_score_color(score_points),
            is_set_won: (max_score == score_points),
        }
    )
}

#[tauri::command]
pub fn is_game_won(game_id: i64, team_a_id: i64, team_b_id: i64) -> Result<bool, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;

    let team_a_set_number = get_set_number(&connection, &game_id, &team_a_id)?;
    let team_b_set_number = get_set_number(&connection, &game_id, &team_b_id)?;
    let game_set = get_game_set(&connection, &game_id)?;

    println!("--------------------------GAME ID: {}------------------------------------", game_id);
    println!("SET: {}", game_set);
    println!("Team A set number: {} \nTeam B set number: {}", team_a_set_number, team_b_set_number);
    println!("----------------------------------------------------------------------------------");

    match game_set {
        1 => Ok(false),
        2 => {
            let value = at_two(team_a_set_number, team_b_set_number);
            Ok(verify_help(&connection, game_id, value)?)
        },
        3 => {
            let value = at_three(team_a_set_number, team_b_set_number);
            Ok(verify_help(&connection, game_id, value)?)
        },
        _ => panic!("Unexpected game set #{}", game_set)
    }
}

#[tauri::command]
pub fn get_team_name(team_id: i64) -> Result<String, Error> {
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
pub fn update_stage_number(team_id: i64, game_id: i64) -> Result<i64, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    let tmp_set_number = get_set_number(&connection, &game_id, &team_id)?;
    let set_number = tmp_set_number + 1;

    println!("\n\n\n\nSET UPDATE | Game ID: {} | TEAM ID {}\n\tFROM {} -> {}", game_id, team_id, tmp_set_number, set_number);
    record_interaction(set_number, team_id, 0, game_id)?;
    cash_game_set(&connection, &game_id)?;

    Ok(set_number)
}
