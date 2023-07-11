// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod registration;
mod database;

use registration::team_registrator;
use registration::players;

fn start_database(){
    database::creation::create_persistent_db().expect("Could not start persistent database");
    database::creation::create_temporal_db().expect("Could not start temporal database");
}

fn main() {
    start_database();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            team_registrator::save_team,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
