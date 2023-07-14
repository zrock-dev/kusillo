use rusqlite::Connection;
use crate::database::game_match::game_creation::GAME_DATABASE;
use crate::utils::rusqlite_error::Error;

#[derive(serde::Serialize)]
pub struct TupleHelper {
    item_a: i64,
    item_b: i64
}

#[derive(serde::Serialize)]
pub struct Configuration {
    max_score: i64,
    score_color: String
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

#[tauri::command]
pub fn request_configuration(set_number: i64, score_points: i64) -> Configuration{
    Configuration{
        max_score: get_max_score(set_number),
        score_color: get_score_color(score_points)
    }
}

fn get_score_color(score_points: i64) -> String{
    match score_points {
        points if points < 16 => String::from("white"),
        points if points == 16 => String::from("orange"),
        points if points == 18 => String::from("pink"),
        points if points == 17 => String::from("red"),
        _ => panic!()
    }
}

fn get_max_score(set_number: i64) -> i64{
    match set_number {
        number if number < 3 && number > 0 => 20,
        number if number == 3 => 18,
        _ => panic!()
    }
}
