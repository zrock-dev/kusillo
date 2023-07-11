use rusqlite::{Connection, Error};

pub fn add_team() -> Result<i64, Error> {
    let connection = Connection::open("temporal_registration.db")?;
    connection.execute("INSERT INTO teams VALUES (NULL, NULL)", ())?;

    let id: i64 = connection.last_insert_rowid();

    Ok(id)
}

pub fn add_player() -> Result<i64, Error> {
    let connection = Connection::open("temporal_registration.db")?;
    connection.execute("INSERT INTO players VALUES (NULL, NULL)", ())?;

    let id: i64 = connection.last_insert_rowid();

    Ok(id)
}

pub fn remove_player(id: &i64) -> Result<(), Error>{
    let connection = Connection::open("temporal_registration.db")?;
    connection.execute("DELETE FROM players WHERE rowid = (?1)", [id])?;

    Ok(())
}
