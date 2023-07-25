use rusqlite::Connection;
use crate::database::game_match::utils::{retrieve_game_set, retrieve_latest_game_id};
use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;
use crate::game_match::clock::clock_manager::Time;

pub fn is_clock_on_time(time: &Time) -> bool{
    let connection = Connection::open(PERM_TEAM_PLAYERS).unwrap();
    let game_id = retrieve_latest_game_id(&connection).unwrap();
    let game_set = retrieve_game_set(&connection, &game_id).unwrap();

    match game_set {
        1 => {time.minutes <= 20},
        2 => {time.minutes <= 20}
        3 => {time.minutes <= 15}
        _ => panic!()
    }
}
