// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod utils;

use database::registration::creation::create_db;
use database::registration::teams;
use database::registration::players;
use crate::database::registration::creation::{PERM_TEAM_PLAYERS, TEMP_TEAM_PLAYERS};

fn main() {
    create_db(TEMP_TEAM_PLAYERS);
    create_db(PERM_TEAM_PLAYERS);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            teams::create_team,
            teams::cancel_registration,
            teams::update_team,
            teams::can_append_player,
            teams::can_submit_team,
            players::insert_player,
            players::remove_player,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
