use rusqlite::Connection;
use crate::errors::Error;

pub fn retrieve_contenders_value_i64(connection: &Connection, contender_id: &i64, column_name: &str) -> Result<i64, Error> {
    let query = format!("SELECT {} FROM contenders WHERE rowid = ?1", column_name);
    let value = connection.query_row_and_then(
        query.as_str(),
        [contender_id],
        |row| {
            Ok::<i64, Error>(
                row.get(0)?
            )
        },
    )?;

    Ok(value)
}

pub fn retrieve_contenders_value_string(connection: &Connection, contender_id: &i64, column_name: &str) -> Result<String, Error> {
    let query = format!("SELECT {} FROM contenders WHERE rowid = ?1", column_name);
    let value = connection.query_row_and_then(
        query.as_str(),
        [contender_id],
        |row| {
            Ok::<String, Error>(
                row.get(0)?
            )
        },
    )?;

    Ok(value)
}
