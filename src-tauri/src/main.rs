// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use database::registration::players;
use database::registration::teams;

mod database;
mod game_match;
pub mod clock;
pub mod timeout;
pub mod errors;
mod transitions;
mod audience_window;

#[tokio::main]
async fn main() {
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
                clock::commands::create_clock,
                clock::commands::pause_clock,
                clock::commands::start_clock,
                clock::commands::request_current_time,
                timeout::commands::request_timeout,
                timeout::commands::request_timeout_finish,
            game_match::commands::create_new_game,
            game_match::commands::record_interaction,
            game_match::commands::handle_score_update,
            game_match::commands::request_game_init_data,
            game_match::commands::request_latest_contenders,
            game_match::commands::request_teams,
            transitions::commands::request_game_dialog_close,
            transitions::commands::request_stage_dialog_close,
            audience_window::commands::open_audience_window,
            audience_window::commands::check_on_audience_window,
            audience_window::commands::is_audience_window_open,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


