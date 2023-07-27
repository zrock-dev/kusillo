use rusqlite::Connection;
use serde::Serialize;
use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;
use crate::errors::Error;

#[derive(Serialize)]
pub struct Team {
    pub id: i64,
    pub name: String,
}

pub fn retrieve_team_name(team_id: i64) -> Result<String, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    let value = connection.query_row_and_then(
        "SELECT name FROM teams WHERE rowid = ?1",
        [team_id],
        |row| {
            Ok::<String, Error>(
                row.get(0)?
            )
        },
    )?;

    Ok(value)
}

pub fn retrieve_teams() -> Result<Vec<Team>, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    let mut statement = connection.prepare("SELECT rowid, name FROM teams")?;
    let teams = statement.query_map(
        [],
        |row| {
            Ok(Team {
                id: row.get(0)?,
                name: row.get(1)?,
            })
        },
    )?;

    let mut team_array: Vec<Team> = Vec::new();
    for team in teams {
        team_array.push(team?);
    }
    Ok(team_array)
}