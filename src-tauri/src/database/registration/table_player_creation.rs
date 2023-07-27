use rusqlite::{Connection};
use crate::database::utils::create_table;

pub const TEMP_TEAM_PLAYERS : &str = "temp_team_players.db";
pub const PERM_TEAM_PLAYERS : &str = "team_players.db";


pub fn create_db(name: &str){
        let connection = Connection::open(name)
            .expect(&format!("Unable to create a database for: {}", name));
    
    create_table(
        &connection,
        "CREATE TABLE IF NOT EXISTS players (
            team_id INTEGER,
            first_name TEXT NULL,
            last_name TEXT NULL,
            FOREIGN KEY (team_id) REFERENCES teams (rowid)
        )"
    );

    create_table(
        &connection,
        "CREATE TABLE IF NOT EXISTS teams (
            rowid INTEGER NOT NULL PRIMARY KEY,
            name TEXT NULL,
            category TEXT NULL
        )"
    );
}


