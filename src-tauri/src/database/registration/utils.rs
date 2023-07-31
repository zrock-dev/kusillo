use rusqlite::Connection;
use serde::Serialize;
use crate::database::game_match::actions::{Contender, retrieve_score_value};
use crate::database::game_match::contenders::{retrieve_contenders_value_i64, retrieve_contenders_value_string};
use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;
use crate::errors::Error;

#[derive(Serialize)]
pub struct Team {
    pub id: i64,
    pub name: String,
}

pub fn retrieve_team(contender_id: &i64, game_id: &i64) -> Result<Contender, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;

    let team_id = retrieve_contenders_value_i64(&connection, &contender_id, "team_id")?;
    let team_name = retrieve_team_value(&connection, "name", &team_id)?;
    let team_color = retrieve_contenders_value_string(&connection, &contender_id, "color")?;

    Ok(Contender {
        id: *contender_id,
        name: team_name,
        set_points: retrieve_score_value(&connection, "set_number", &game_id, &contender_id)?,
        color: team_color,
    })
}


pub fn retrieve_team_value(connection: &Connection, column_name: &str, team_id: &i64) -> Result<String, Error> {
    let query = format!("SELECT {} FROM teams WHERE rowid = ?1", column_name);
    let value = connection.query_row_and_then(
        query.as_str(),
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
