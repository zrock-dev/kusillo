use rusqlite::Connection;
use crate::database::game_match::game_creation::GAME_DATABASE;
use crate::database::game_match::utils::{get_max_score, get_score_color, record_winner};
use crate::utils::rusqlite_error::Error;

#[derive(serde::Serialize)]
pub struct Contestants {
    match_id: i64,
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
    let connection = Connection::open(GAME_DATABASE)?;
    connection.execute(
        "INSERT INTO match VALUES (?1, ?2)",
    [team_a_id, team_b_id])?;

    Ok(())
}

#[tauri::command]
pub fn request_contenders() -> Result<Contestants, Error>{
    let connection = Connection::open(GAME_DATABASE)?;

    let contestants = connection.query_row_and_then(
        "SELECT rowid, team_a_id, team_b_id FROM match ORDER BY rowid DESC LIMIT 1",
        [],
        |row| {
            Ok::<Contestants, Error>( Contestants {
                match_id: row.get(0)?,
                team_a_id: row.get(1)?,
                team_b_id: row.get(2)?
            })
        },
    )?;

    Ok(contestants)
}

#[tauri::command]
pub fn record_interaction(set_number: i64, team_id: i64, score_points: i64) -> Result<(), Error>{
    let connection = Connection::open(GAME_DATABASE)?;
    connection.execute(
        "INSERT INTO score VALUES ((SELECT rowid FROM match ORDER BY rowid DESC LIMIT 1), ?1, ?2, ?3, (SELECT DATETIME()))",
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
    let contenders = request_contenders()?;
    let connection = Connection::open(GAME_DATABASE)?;
    
    let team_a_set_number = connection.query_row_and_then(
        "SELECT set_number FROM score WHERE team_id = ?1 ORDER BY rowid DESC LIMIT 1",
        [contenders.team_a_id],
        |row| {
            Ok::<i64, Error>(
                row.get(0)?
            )
        },
    )?;

    let team_b_set_number = connection.query_row_and_then(
        "SELECT set_number FROM score WHERE match_id = ?1 AND team_id = ?2 ORDER BY rowid DESC LIMIT 1",
        [contenders.match_id, contenders.team_b_id],
        |row| {
            Ok::<i64, Error>(
                row.get(0)?
            )
        },
    )?;
    
    if team_a_set_number == 3 {
        record_winner(&connection, &contenders.match_id, &contenders.team_a_id)?;
        Ok(true)
    }else if team_b_set_number == 3 {
        record_winner(&connection, &contenders.match_id, &contenders.team_b_id)?;
        Ok(true)
    }else if team_a_set_number == 2 && team_b_set_number == 0 {
        record_winner(&connection, &contenders.match_id, &contenders.team_a_id)?;
        Ok(true)
    }else if team_b_set_number == 2 && team_a_set_number == 0 {
        record_winner(&connection, &contenders.match_id, &contenders.team_b_id)?;
        Ok(true)
    }else {
        Ok(false)
    }
}
