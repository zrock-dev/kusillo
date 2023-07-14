use rusqlite::Connection;
use crate::database::utils::create_table;
use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;

pub fn create_game_db(){
    let connection = Connection::open(PERM_TEAM_PLAYERS)
        .expect(&format!("Unable to create a database for: {}", PERM_TEAM_PLAYERS));
    
    create_table(
        &connection,
        "CREATE TABLE IF NOT EXISTS game (
                    rowid INTEGER NOT NULL PRIMARY KEY,
                    team_a_id INTEGER NOT NULL,
                    team_b_id INTEGER NOT NULL
                )"
    );

    create_table(
        &connection,
        "CREATE TABLE IF NOT EXISTS score (
                    game_id INTEGER NOT NULL,
                    set_number INTEGER NOT NULL,
                    score_points INTEGER NOT NULL,
                    team_id INTEGER NOT NULL,
                    timestamp datetime NOT NULL,
                    FOREIGN KEY (game_id) REFERENCES game (rowid)
                )"
    );

    create_table(
        &connection,
        "CREATE TABLE IF NOT EXISTS winners (
            game_id integer NOT NULL,
            team_id integer NOT NULL
        )"
    );
}
