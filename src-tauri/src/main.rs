// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod utils;

use database::registration::teams;
use database::registration::players;
use database::game_match::game;


fn main() {
    database::startup();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            teams::create_team,
            teams::cancel_registration,
            teams::update_team,
            teams::can_append_player,
            teams::can_submit_team,
            players::insert_player,
            players::remove_player,
            game::make_match,
            game::request_contenders,
            game::record_interaction
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

