use rusqlite::Connection;
use crate::database::utils::create_table;

pub const GAME_DATABASE: &str = "game_matches.db";

pub fn create_game_db(){
    let connection = Connection::open(GAME_DATABASE)
        .expect(&format!("Unable to create a database for: {}", GAME_DATABASE));
    
    create_table(
        &connection,
        "CREATE TABLE IF NOT EXISTS match (team_a_id INTEGER NOT NULL, team_b_id INTEGER NOT NULL)"
    ).expect(&format!("Unable to create table match for database {}", GAME_DATABASE));

    create_table(
        &connection,
        "CREATE TABLE IF NOT EXISTS score (
                    match_id INTEGER NOT NULL,
                    set_number INTEGER NOT NULL,
                    score_points INTEGER NOT NULL,
                    team_id INTEGER NOT NULL,
                    timestamp datetime NOT NULL
                    FOREIGN KEY(match_id) REFERENCES match(rowid)  	
                )"
    ).expect(&format!("Unable to create table game for database {}", GAME_DATABASE));
}
