use rusqlite::Connection;
use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;
use crate::errors::Error;

pub fn retrieve_team_name(team_id: i64) -> Result<String, Error>{
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