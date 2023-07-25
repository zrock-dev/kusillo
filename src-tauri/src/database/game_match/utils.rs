use rusqlite::Connection;
use crate::database::game_match::game_commands::Contestants;
use crate::utils::rusqlite_error::Error;

pub fn record_winner(connection: &Connection, game_id: &i64, team_id: &i64) -> Result<(), Error>{
    connection.execute(
        "INSERT INTO winners VALUES (?1, ?2)",
        [game_id, team_id]
    )?;
    Ok(())
}

pub fn retrieve_score_value(connection: &Connection, value_name: &str, game_id: &i64, team_id: &i64) -> Result<i64, Error>{
    let query = format!("SELECT {} FROM score WHERE game_id = ?1 AND team_id = ?2 ORDER BY rowid DESC LIMIT 1", value_name);
    let set_number = connection.query_row_and_then(
        query.as_str(),
        [game_id, team_id],
        |row| {
            Ok::<i64, Error>(
                row.get(0)?
            )
        },
    )?;

    Ok(set_number)
}

pub fn retrieve_game_set(connection: &Connection, game_id: &i64) -> Result<i64, Error>{
    let set_number = connection.query_row_and_then(
        "SELECT set_number FROM game WHERE rowid = ?1",
        [game_id],
        |row| {
            Ok::<i64, Error>(
                row.get(0)?
            )
        },
    )?;
    Ok(set_number)
}

pub fn update_game_set(connection: &Connection, &game_id: &i64) -> Result<(), Error>{
   let set_number  = retrieve_game_set(connection, &game_id)?;
    connection.execute(
        "UPDATE game SET set_number = ?1 WHERE rowid = ?2",
        [set_number + 1, game_id]
    )?;

    Ok(())
}

pub fn retrieve_contenders(connection: &Connection, game_id: &i64) -> Result<Contestants, Error>{
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

pub fn record_to_score_table(connection: &Connection, game_id: &i64, team_id: &i64, score_points: &i64, current_stage: &i64) -> Result<(), Error>{
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
