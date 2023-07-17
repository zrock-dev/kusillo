// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod utils;

use database::registration::teams;
use database::registration::players;
use database::game_match::game_commands;


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
            game_commands::make_match,
            game_commands::request_contenders,
            game_commands::record_interaction,
            game_commands::request_configuration,
            game_commands::is_game_won,
            game_commands::get_team_name
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


