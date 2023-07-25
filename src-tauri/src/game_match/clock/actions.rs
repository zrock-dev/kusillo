use rusqlite::Connection;
use crate::database::game_match::utils::{retrieve_game_value, retrieve_latest_game_id, update_game_value};
use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;
use crate::game_match::clock::clock_manager::Time;

pub fn is_clock_on_time(time: &Time) -> bool{
    let connection = Connection::open(PERM_TEAM_PLAYERS).unwrap();
    let game_id = retrieve_latest_game_id(&connection).unwrap();
    let game_set = retrieve_game_value(&connection,"set_number",  &game_id).unwrap();

    if game_set < 2 {
        time.minutes <= 19
    }else {
        time.minutes <= 14
    }
}

pub fn record_timeout(){
    let connection = Connection::open(PERM_TEAM_PLAYERS).unwrap();
    let game_id = retrieve_latest_game_id(&connection).unwrap();
    update_game_value(&connection, &game_id ,"on_time", 0).unwrap();
}