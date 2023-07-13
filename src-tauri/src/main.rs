// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod registration;
mod database;
mod utils;

use database::creation::create_db;
use database::teams;
use database::players;

fn main() {
    create_db("temp_team_players.db");
    create_db("team_players.db");

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
