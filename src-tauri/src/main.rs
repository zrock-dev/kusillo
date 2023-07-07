// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod registration;
mod database;

use registration::team_registrator;
use registration::players;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            players::add,
            team_registrator::save_team,
            team_registrator::validate_category,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
