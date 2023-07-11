use rusqlite::{Connection, Result};

fn create_table(connection: &Connection, statement: &str) -> Result<usize>{
    connection.execute(statement, ())
}

pub fn create_temporal_db() -> Result<()>{
    let connection = Connection::open("temporal_registration.db")?;
    create_table(
        &connection,
        "CREATE TABLE IF NOT EXISTS players ( first_name TEXT NULL, last_name TEXT NULL )"
    )?;

    create_table(
        &connection,
        "CREATE TABLE IF NOT EXISTS teams ( name TEXT NULL, category TEXT NULL)"
    )?;

    Ok(())
}

pub fn create_persistent_db() -> Result<()>{
    let connection = Connection::open("temporal_registration.db")?;
    create_table(
        &connection,
        "CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY,
            team_id INTEGER,
            first_name TEXT NULL,
            last_name TEXT NULL,
            FOREIGN KEY (team_id) REFERENCES teams (id)
        )"
    )?;

    create_table(
        &connection,
        "CREATE TABLE IF NOT EXISTS teams (
            id INTEGER PRIMARY KEY,
            name TEXT NULL,
            category TEXT NULL
        )"
    )?;

    Ok(())
}
