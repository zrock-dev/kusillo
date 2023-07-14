use rusqlite::Connection;
use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;
use crate::database::game_match::utils::{get_max_score, get_score_color, get_set_number, record_winner};
use crate::database::utils::is_table_empty;
use crate::utils::rusqlite_error::Error;

#[derive(serde::Serialize)]
pub struct Contestants {
    game_id: i64,
    team_a_id: i64,
    team_b_id: i64
}

#[derive(serde::Serialize)]
pub struct Configuration {
    max_score: i64,
    score_color: String,
    is_set_won: bool,
}

#[tauri::command]
pub fn make_match(team_a_id: i64, team_b_id: i64) -> Result<(), Error>{
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    connection.execute(
        "INSERT INTO game VALUES (?1, ?2)",
    [team_a_id, team_b_id])?;

    Ok(())
}

#[tauri::command]
pub fn request_contenders() -> Result<Contestants, Error>{
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;

    let contestants = connection.query_row_and_then(
        "SELECT rowid, team_a_id, team_b_id FROM game ORDER BY rowid DESC LIMIT 1",
        [],
        |row| {
            Ok::<Contestants, Error>( Contestants {
                game_id: row.get(0)?,
                team_a_id: row.get(1)?,
                team_b_id: row.get(2)?
            })
        },
    )?;

    Ok(contestants)
}

#[tauri::command]
pub fn record_interaction(set_number: i64, team_id: i64, score_points: i64) -> Result<(), Error>{
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    connection.execute(
        "INSERT INTO
            score (game_id, set_number, score_points, team_id, timestamp)
            VALUES (
                 (SELECT rowid FROM game ORDER BY rowid DESC LIMIT 1),
                 ?1, ?2, ?3,
                 (SELECT DATETIME())
            )",
        [set_number, score_points, team_id]
    )?;

    Ok(())
}

#[tauri::command]
pub fn request_configuration(set_number: i64, score_points: i64) -> Configuration{
    let max_score = get_max_score(set_number);
    
    Configuration{
        max_score,
        score_color: get_score_color(score_points),
        is_set_won: (max_score == score_points),
    }
}

#[tauri::command]
pub fn is_game_won() -> Result<bool, Error>{
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;

    let empty_score = is_table_empty(&connection, "score")?;
    if empty_score  {
        return Ok(false)
    }

    let contenders = request_contenders()?;
    let game_id = contenders.game_id;
    let team_a_set_number = get_set_number(&connection, &game_id, &contenders.team_a_id)?;
    let team_b_set_number = get_set_number(&connection, &game_id, &contenders.team_b_id)?;


    if team_a_set_number == 3 {
        record_winner(&connection, &game_id, &contenders.team_a_id)?;
        Ok(true)
    }else if team_b_set_number == 3 {
        record_winner(&connection, &game_id, &contenders.team_b_id)?;
        Ok(true)
    }else if team_a_set_number == 2 && team_b_set_number == 0 {
        record_winner(&connection, &game_id, &contenders.team_a_id)?;
        Ok(true)
    }else if team_b_set_number == 2 && team_a_set_number == 0 {
        record_winner(&connection, &game_id, &contenders.team_b_id)?;
        Ok(true)
    }else {
        Ok(false)
    }
}
