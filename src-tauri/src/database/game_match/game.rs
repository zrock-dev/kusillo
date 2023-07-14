use rusqlite::Connection;
use crate::database::game_match::creation::GAME_DATABASE;
use crate::utils::rusqlite_error::Error;

#[derive(serde::Serialize)]
pub struct TupleHelper {
    item_a: i64,
    item_b: i64
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
pub fn request_contenders() -> Result<TupleHelper, Error>{
    let connection = Connection::open(GAME_DATABASE)?;

    let contestants = connection.query_row_and_then(
        "SELECT rowid FROM match ORDER BY rowid DESC LIMIT 1",
        [],
        |row| {
            Ok::<TupleHelper, Error>( TupleHelper {
                item_a: row.get(0)?,
                item_b: row.get(1)?
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
