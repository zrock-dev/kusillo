pub mod data;

use rusqlite::Connection;
use crate::utils::rusqlite_error::Error;

pub fn create_table(connection: &Connection, statement: &str){
    connection
        .execute(statement, ())
        .unwrap_or_else(
            |error| {
                panic!("Unable to create table\n {}", error)
            }
        );
}

pub fn is_table_empty(connection: &Connection, table_name: &str) -> Result<bool, Error>{
    let query = format!("SELECT COUNT(*) FROM {}", table_name);
    let count = connection.query_row_and_then(
        &query,
        [],
        |row| {
            let count: i64 = row.get(0)?;
            Ok::<i64, Error>(count)
        },
    )?;

    Ok(count == 0)
}
