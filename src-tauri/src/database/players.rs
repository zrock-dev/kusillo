use rusqlite::{Connection, params};
use crate::utils::rusqlite_error::Error;


#[tauri::command]
pub fn insert_player(first_name: &str, last_name: &str, team_id: i64) -> Result<i64, Error> {
    let connection = Connection::open("team_players.db")?;
    connection.execute(
        "INSERT INTO players VALUES (?1, '?2', '?3')",
        params![team_id, first_name, last_name]
    )?;

    let id: i64 = connection.last_insert_rowid();

    Ok(id)
}

#[tauri::command]
pub fn remove_player(id: i64) -> Result<(), Error>{
    let connection = Connection::open("team_players.db")?;
    connection.execute(
        "DELETE FROM players WHERE rowid = ?1",
        [id]
    )?;
    Ok(())
}

#[tauri::command]
pub fn can_add(team_id: i64) -> Result<bool, Error>{
    let connection = Connection::open("team_players.db")?;

    let count = connection.query_row_and_then(
        "SELECT COUNT(*) FROM players WHERE rowid = 1?",
        [team_id],
        |row| {
            let count: i64 = row.get(0)?;
            Ok::<i64, Error>(count)
        },
    )?;

    Ok(count <= 4)
}