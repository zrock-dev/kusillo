use rusqlite::{Connection, params};
use crate::utils::rusqlite_error::Error;


#[tauri::command]
pub fn create_team() -> Result<i64, Error> {
    let connection = Connection::open("team_players.db")?;
    connection.execute("INSERT INTO teams (name, category) VALUES (NULL, NULL)", ())?;

    let id: i64 = connection.last_insert_rowid();
    println!("A team entry has been created with ID: {}", id);

    Ok(id)
}

#[tauri::command]
pub fn update_team(name: &str, category: &str, team_id: isize) -> Result<(), Error>{
    let connection = Connection::open("team_players.db")?;

    entry_exists(&connection, team_id)?;
    connection.execute("UPDATE teams SET name = ?1, category = ?2 WHERE rowid=?3", params![name, category, team_id])?;

    Ok(())
}

#[tauri::command]
pub fn cancel_registration(team_id: isize)-> Result<(), Error>{
    let connection = Connection::open("team_players.db")?;

    entry_exists(&connection, team_id)?;
    connection.execute("DELETE FROM players WHERE team_id = ?1", [team_id])?;
    connection.execute("DELETE FROM teams WHERE rowid = ?1", [team_id])?;

    Ok(())
}

pub fn entry_exists(connection: &Connection, team_id: isize) -> Result<bool, Error>{
    let count = connection.query_row_and_then(
        "SELECT COUNT(*) FROM teams WHERE rowid = ?",
        [team_id],
        |row| {
            let count: i64 = row.get(0)?;
            Ok::<i64, Error>(count)
        },
    )?;

    if count == 1 {
        Ok(true)
    }else {
        Err(Error::CustomError(String::from(format!("Provided team id {} has {} entries.", team_id, count))))
    }
}

#[tauri::command]
pub fn can_append_player(team_id: isize) -> Result<bool, Error>{
    let connection = Connection::open("team_players.db")?;
    entry_exists(&connection, team_id)?;
    let players_amount = count_players(&connection, team_id)?;
    Ok(players_amount < 4) 
}

#[tauri::command]
pub fn can_submit_team(team_id: isize) -> Result<bool, Error>{
    let connection = Connection::open("team_players.db")?;
    entry_exists(&connection, team_id)?;
    let players_amount = count_players(&connection, team_id)?;
    Ok(players_amount >= 2 && players_amount <= 4) 
}

fn count_players(connection: &Connection, team_id: isize)-> Result<i64, Error>{
    let count = connection.query_row_and_then(
        "SELECT COUNT(*) FROM players WHERE team_id = ?",
        [team_id],
        |row| {
            let count: i64 = row.get(0)?;
            Ok::<i64, Error>(count)
        },
    )?;

    Ok(count)
}
