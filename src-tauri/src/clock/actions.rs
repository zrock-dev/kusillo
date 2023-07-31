use rusqlite::Connection;
use tauri::AppHandle;
use crate::clock::clock_manager::Time;
use crate::database::game_match::actions::{retrieve_game_value, retrieve_latest_game_id};
use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;
use crate::game_match::actions::{reset_stage, update_game_status, update_team_stage_on_timeout};

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

    let is_update_successful = update_team_stage_on_timeout(handle, &connection, game_id).unwrap();
    if is_update_successful {
        reset_stage(handle, game_id).unwrap();
        update_game_status(&handle, game_id).unwrap();
    }
}
