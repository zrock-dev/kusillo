use crate::database::registration::table_player_creation::{PERM_TEAM_PLAYERS, TEMP_TEAM_PLAYERS};
use crate::database::registration::table_player_creation::create_db;
use crate::database::game_match::game_creation::create_game_db;

pub mod registration;
pub mod game_match;
mod utils;

pub fn startup(){
    create_db(TEMP_TEAM_PLAYERS);
    create_db(PERM_TEAM_PLAYERS);
    create_game_db();
}

