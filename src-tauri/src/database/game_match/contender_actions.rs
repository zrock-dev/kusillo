use rusqlite::{Connection, params};
use crate::errors::Error;

pub struct ContendersCreation {
    pub team_a: ContenderCreation,
    pub team_b: ContenderCreation,
}

pub struct ContenderCreation {
    pub id: i64,
    pub color: String,
}

pub fn create_contender_row(connection: &Connection, contender: ContenderCreation) -> Result<i64, Error>{
    connection.execute(
        "INSERT INTO contenders (team_id, color) VALUES (?1, ?2)",
    params![contender.id, contender.color]
    )?;

    Ok(connection.last_insert_rowid())
}

pub fn create_game_row(connection: &Connection, contenders: ContendersCreation) -> Result<(), Error>{
    let contender_a_id = create_contender_row(&connection, contenders.team_a)?;
    let contender_b_id = create_contender_row(&connection, contenders.team_b)?;

    connection.execute(
        "INSERT INTO game (contender_a_id, contender_b_id, set_number, on_time) VALUES (?1, ?2, 0, 1)",
        params![contender_a_id, contender_b_id]
    )?;

   Ok(())
}
