// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod registration;

use registration::team_registrator::TeamRegistrator;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    // tauri::Builder::default()
    //     .invoke_handler(tauri::generate_handler![greet])
    //     .run(tauri::generate_context!())
    //     .expect("error while running tauri application");

    let mut registrator = TeamRegistrator::new();
    registrator.save_player("Mishel", "Paz");
    registrator.save_player("Mishel", "Preciosa");
    registrator.save_player("Mishel", "Vuelve");

    registrator.set_category("First");
    registrator.set_name("Los reales");
    registrator.store();

    dbg!(registrator);
}
