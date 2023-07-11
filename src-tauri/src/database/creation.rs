use rusqlite::{Connection, Result};
use crate::utils::rusqlite_error::Error;

fn create_table(connection: &Connection, statement: &str) -> Result<usize>{
    connection.execute(statement, ())
}

pub fn create_persistent_db() -> Result<(), Error>{
    let connection = Connection::open("team_players.db")?;
    create_table(
        &connection,
        "CREATE TABLE IF NOT EXISTS players (
            team_id INTEGER,
            first_name TEXT NULL,
            last_name TEXT NULL,
            FOREIGN KEY (team_id) REFERENCES teams (id)
        )"
    )?;

    create_table(
        &connection,
        "CREATE TABLE IF NOT EXISTS teams (
            name TEXT NULL,
            category TEXT NULL
        )"
    )?;

    Ok(())
}
