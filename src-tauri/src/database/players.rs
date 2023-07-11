use rusqlite::{Connection, params};
use crate::utils::rusqlite_error::Error;


#[tauri::command]
pub fn add_player(first_name: &str, last_name: &str, team_id: i64) -> Result<i64, Error> {
    let connection = Connection::open("team_players.db")?;
    let mut statement = connection.prepare("INSERT INTO players VALUES (?1, ?2, ?3)")?;
    statement.execute(params![team_id, first_name, last_name])?;

    let id: i64 = connection.last_insert_rowid();

    Ok(id)
}

#[tauri::command]
pub fn remove_player(id: i64) -> Result<(), Error>{
    let connection = Connection::open("team_players.db")?;
    connection.execute("DELETE FROM players WHERE rowid = ?1", [id])?;

    Ok(())
}

#[tauri::command]
pub fn can_add(players_size: i64) -> bool{
    players_size <= 4
}