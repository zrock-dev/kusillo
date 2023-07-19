use rusqlite::{Connection, params};
use crate::database::registration::table_player_creation::{PERM_TEAM_PLAYERS, TEMP_TEAM_PLAYERS};
use crate::database::utils::data::{Player};
use crate::utils::rusqlite_error::Error;


#[tauri::command]
pub fn create_team() -> Result<i64, Error> {
    let connection = Connection::open(TEMP_TEAM_PLAYERS)?;

    let count = connection.query_row_and_then(
        "SELECT COUNT(*) FROM teams",
        [],
        |row| {
            let count: i64 = row.get(0)?;
            Ok::<i64, Error>(count)
        },
    )?;

    if count != 0 {
        cleanup(&connection)?;
    }

    connection.execute("INSERT INTO teams (name, category) VALUES (NULL, NULL)", ())?;
    let id: i64 = connection.last_insert_rowid();
    println!("A team entry has been created with ID: {}", id);

    Ok(id)
}

#[tauri::command]
pub fn update_team(name: &str, category: &str, team_id: isize) -> Result<(), Error>{
    let temp_db_conn = Connection::open(TEMP_TEAM_PLAYERS)?;
    entry_exists(&temp_db_conn, team_id)?;

    let mut statement = temp_db_conn.prepare("SELECT first_name, last_name FROM players WHERE team_id = ?1")?;
    let players = statement.query_map(
        params![team_id],
        |row|{
            Ok( Player {
                first_name: row.get(0)?,
                last_name: row.get(1)?
            })
        }
    )?;
    cleanup(&temp_db_conn)?;

    let db_conn = Connection::open(PERM_TEAM_PLAYERS)?;
    db_conn.execute(
        "INSERT INTO teams (name, category) VALUES (?1, ?2)",
        [name, category]
    )?;

    let id = db_conn.last_insert_rowid();
    for player in players {
        let player = player?;
        db_conn.execute(
            "INSERT INTO players VALUES (?1, ?2, ?3)",
            params![id, player.first_name, player.last_name]
        )?;
    }

    Ok(())
}

#[tauri::command]
pub fn cancel_registration(team_id: isize)-> Result<(), Error>{
    let connection = Connection::open(TEMP_TEAM_PLAYERS)?;

    entry_exists(&connection, team_id)?;
    connection.execute("DELETE FROM players WHERE team_id = ?1", [team_id])?;
    connection.execute("DELETE FROM teams WHERE rowid = ?1", [team_id])?;

    Ok(())
}

#[tauri::command]
pub fn can_append_player(team_id: isize) -> Result<bool, Error>{
    let connection = Connection::open(TEMP_TEAM_PLAYERS)?;
    entry_exists(&connection, team_id)?;
    let players_amount = count_players(&connection, team_id)?;
    Ok(players_amount < 4) 
}

#[tauri::command]
pub fn can_submit_team(team_id: isize) -> Result<bool, Error>{
    let connection = Connection::open(TEMP_TEAM_PLAYERS)?;
    entry_exists(&connection, team_id)?;
    let players_amount = count_players(&connection, team_id)?;
    Ok(players_amount >= 2 && players_amount <= 4)
}

fn entry_exists(connection: &Connection, team_id: isize) -> Result<bool, Error>{
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

fn count_players(connection: &Connection, team_id: isize) -> Result<i64, Error>{
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

fn cleanup(connection: &Connection) -> Result<(), Error>{
    connection.execute("DELETE FROM players", ())?;
    connection.execute("DELETE FROM teams", ())?;
    Ok(())
} 

