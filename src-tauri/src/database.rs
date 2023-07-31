use crate::database::game_match::game_creation::create_game_db;
use crate::database::registration::table_player_creation::{PERM_TEAM_PLAYERS, TEMP_TEAM_PLAYERS};
use crate::database::registration::table_player_creation::create_db;

pub mod registration;
mod utils;
pub mod game_match;

pub fn startup(){
    create_db(TEMP_TEAM_PLAYERS);
    create_db(PERM_TEAM_PLAYERS);
    create_game_db();
}

