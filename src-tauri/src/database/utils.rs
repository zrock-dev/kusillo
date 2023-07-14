use rusqlite::Connection;
use crate::utils::rusqlite_error::Error;

pub mod data;

pub fn create_table(connection: &Connection, statement: &str) -> Result<(), Error>{
    connection.execute(statement, ())?;
    Ok(())
}

