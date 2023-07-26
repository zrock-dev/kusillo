use rusqlite::{Connection, params};
use crate::errors::Error;
use serde::Serialize;

#[derive(Serialize)]
pub struct Contestants{
    pub game_id: i64,
    pub team_a_id: i64,
    pub team_b_id: i64,
}

pub fn record_winner(connection: &Connection, game_id: &i64, team_id: &i64) -> Result<(), Error> {
    connection.execute(
        "INSERT INTO winners VALUES (?1, ?2)",
        [game_id, team_id],
    )?;
    Ok(())
}

pub fn retrieve_score_value(connection: &Connection, column_name: &str, game_id: &i64, team_id: &i64) -> Result<i64, Error> {
    let query = format!("SELECT {} FROM score WHERE game_id = ?1 AND team_id = ?2 ORDER BY rowid DESC LIMIT 1", column_name);
    let value = connection.query_row_and_then(
        query.as_str(),
        [game_id, team_id],
        |row| {
            Ok::<i64, Error>(
                row.get(0)?
            )
        },
    )?;

    Ok(value)
}

pub fn retrieve_game_value(connection: &Connection, column_name: &str, game_id: &i64) -> Result<i64, Error> {
    let query = format!("SELECT {} FROM game WHERE rowid = ?1", column_name);
    let value = connection.query_row_and_then(
        query.as_str(),
        [game_id],
        |row| {
            Ok::<i64, Error>(
                row.get(0)?
            )
        },
    )?;
    Ok(value)
}


pub fn update_game_value(connection: &Connection, game_id: &i64, column_name: &str, value: i64) -> Result<(), Error> {
    let query = format!("UPDATE game SET {} = ?1 WHERE rowid = ?2", column_name);
    connection.execute(
        query.as_str(),
        params![value, game_id],
    )?;

    Ok(())
}

pub fn retrieve_contenders(connection: &Connection, game_id: &i64) -> Result<Contestants, Error> {
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

pub fn insert_into_score(connection: &Connection, game_id: &i64, team_id: &i64, score_points: &i64, current_stage: &i64) -> Result<(), Error> {
    connection.execute(
        "INSERT INTO
            score (game_id, set_number, score_points, team_id, timestamp)
            VALUES (
                 ?1, ?2, ?3, ?4,
                 (SELECT DATETIME())
            )",
        [game_id, current_stage, score_points, team_id],
    )?;

    Ok(())
}

pub fn cash_team_set(connection: &Connection, team_id: &i64, game_id: &i64) -> Result<i64, Error> {
    let old_set_number = retrieve_score_value(&connection, "set_number", &game_id, &team_id)?;
    let new_set_number = old_set_number + 1;

    insert_into_score(&connection, &game_id, &team_id, &0, &new_set_number)?;
    cash_game_set(&connection, &game_id)?;

    Ok(new_set_number)
}

pub fn cash_game_set(connection: &Connection, &game_id: &i64) -> Result<(), Error> {
    let set_number = retrieve_game_value(&connection, "set_number", &game_id)?;
    update_game_value(&connection, &game_id, "set_number", set_number + 1)?;
    Ok(())
}

pub fn retrieve_latest_game_id(connection: &Connection) -> Result<i64, Error> {
    let game_id = connection.query_row_and_then(
        "SELECT rowid FROM game ORDER BY rowid DESC LIMIT 1",
        [],
        |row| {
            Ok::<i64, Error>(
                row.get(0)?
            )
        },
    )?;
    Ok(game_id)
}
