// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use database::game_match::game_commands;
use database::registration::players;
use database::registration::teams;

mod database;
mod utils;

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
            game_commands::request_team_name,
            game_commands::update_stage_number,
            game_commands::is_set_won,
            game_commands::request_score_color,
            game_commands::is_game_won,
            game_commands::request_max_score,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


