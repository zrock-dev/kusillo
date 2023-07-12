use rusqlite::{Connection, params};
use crate::utils::rusqlite_error::Error;


#[tauri::command]
pub fn create_team() -> Result<i64, Error> {
    let connection = Connection::open("team_players.db")?;
    connection.execute("INSERT INTO teams VALUES (NULL, NULL)", ())?;

    let id: i64 = connection.last_insert_rowid();

    Ok(id)
}

#[tauri::command]
pub fn update_team(name: &str, category: &str, team_id: i64) -> Result<(), Error>{
    let connection = Connection::open("team_players.db")?;

    let mut statement = connection.prepare("UPDATE teams SET name='?1', category='?2', WHERE rowid=?3")?;
    statement.execute(params![name, category, team_id])?;

    Ok(())
}

#[tauri::command]
pub fn cancel_registration(team_id: isize)-> Result<(), Error>{
    let connection = Connection::open("team_players.db")?;

    connection.execute("DELETE FROM players WHERE team_id = (?1)", [team_id])?;
    connection.execute("DELETE FROM teams WHERE rowid = (?1)", [team_id])?;

    Ok(())
}

#[tauri::command]
pub fn is_category_valid(category: &str) -> bool{
    match category {
        "First" => true,
        "Second" => true,
        _ => false
    }
}
