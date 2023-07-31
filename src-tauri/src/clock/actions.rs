use rusqlite::Connection;
use tauri::AppHandle;
use crate::clock::clock_manager::Time;
use crate::database::game_match::actions::{retrieve_game_value, retrieve_latest_game_id, update_game_value};
use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;
use crate::game_match::commands::handle_score_update;
use crate::game_match::utils::is_stage_won_on_timeout;

pub fn is_clock_on_time(connection: &Connection, game_id: i64, time: &Time) -> bool {
    let game_set = retrieve_game_value(&connection, "set_number", &game_id).unwrap();

    if game_set < 2 {
        time.minutes < 20
    } else {
        time.minutes < 16
    }
}

pub fn handle_timeout(handle: &AppHandle) {
    let connection = Connection::open(PERM_TEAM_PLAYERS).unwrap();
    let game_id = retrieve_latest_game_id(&connection).unwrap();

    // TODO: refactor this!!!!
    let (team_id, success) = is_stage_won_on_timeout(&connection, game_id).unwrap();
    update_game_value(&connection, &game_id, "on_time", 0).unwrap();
    if success {
        handle_score_update(handle.clone(), game_id, team_id, true).unwrap();
    }
}
