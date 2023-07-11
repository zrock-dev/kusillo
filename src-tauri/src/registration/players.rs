use rusqlite::{Connection, Error};
use tauri::{command};


#[command]
pub fn can_add(players_size: &i8) -> bool{
    *players_size <= 3
}

pub fn cancel(team_id: &isize)-> Result<(), Error>{
    let connection = Connection::open("temporal_registration.db")?;

    connection.execute("DELETE FROM players WHERE team_id = (?1)", [team_id])?;
    connection.execute("DELETE FROM teams WHERE rowid = (?1)", [team_id])?;

    Ok(())
}