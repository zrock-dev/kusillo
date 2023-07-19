pub mod data;

use rusqlite::Connection;

pub fn create_table(connection: &Connection, statement: &str){
    connection
        .execute(statement, ())
        .unwrap_or_else(
            |error| {
                panic!("Unable to create table\n {}", error)
            }
        );
}
