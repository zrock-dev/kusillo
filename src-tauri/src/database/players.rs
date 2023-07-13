use rusqlite::{Connection, params};
use crate::utils::rusqlite_error::Error;


#[tauri::command]
pub fn insert_player(first_name: &str, last_name: &str, team_id: i64) -> Result<i64, Error> {
    let connection = Connection::open("temp_team_players.db")?;
    connection.execute(
        "INSERT INTO players VALUES (?1, ?2, ?3)",
        params![team_id, first_name, last_name]
    )?;

    Ok(connection.last_insert_rowid())
}

#[tauri::command]
pub fn remove_player(id: i64) -> Result<(), Error>{
    let connection = Connection::open("temp_team_players.db")?;
    connection.execute(
        "DELETE FROM players WHERE rowid = ?1",
        [id]
    )?;

    Ok(())
}

