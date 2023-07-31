use rusqlite::Connection;
use crate::database::utils::create_table;
use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;

pub fn create_game_db(){
    let connection = Connection::open(PERM_TEAM_PLAYERS)
        .expect(&format!("Unable to create a database for: {}", PERM_TEAM_PLAYERS));

    create_table(
        &connection,
        "CREATE TABLE IF NOT EXISTS game (
            rowid INTEGER PRIMARY KEY,
            contender_a_id INTEGER NOT NULL,
            contender_b_id INTEGER NOT NULL,
            set_number INTEGER NOT NULL,
            on_time INTEGER NOT NULL,
            FOREIGN KEY (contender_a_id) REFERENCES contenders (rowid),
            FOREIGN KEY (contender_b_id) REFERENCES contenders (rowid)
        )"
    );

    create_table(
        &connection,
        "CREATE TABLE IF NOT EXISTS score (
            game_id INTEGER NOT NULL,
            set_number INTEGER NOT NULL,
            score_points INTEGER NOT NULL,
            contender_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            FOREIGN KEY (game_id) REFERENCES game (rowid),
            FOREIGN KEY (contender_id) REFERENCES contenders (rowid)
        )"
    );

    create_table(
        &connection,
        "CREATE TABLE IF NOT EXISTS winners (
            game_id INTEGER NOT NULL,
            contender_id INTEGER NOT NULL,
            FOREIGN KEY (game_id) REFERENCES game (rowid),
            FOREIGN KEY (contender_id) REFERENCES contenders (rowid)
        )"
    );

    create_table(
        &connection,
        "CREATE TABLE IF NOT EXISTS contenders (
            rowid INTEGER PRIMARY KEY,
            team_id INTEGER NOT NULL,
            color CHAR(7) NOT NULL
        )"
    );
}
