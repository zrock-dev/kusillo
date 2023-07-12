// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod registration;
mod database;
mod utils;

use database::teams;
use database::players;

fn main() {
    database::creation::create_persistent_db().expect("Could not create database");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            teams::insert_team,
            teams::cancel_registration,
            teams::is_category_valid,
            teams::update_team,
            players::insert_player,
            players::remove_player,
            players::can_add
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
