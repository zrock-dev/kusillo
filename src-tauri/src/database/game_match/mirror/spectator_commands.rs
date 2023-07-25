use tauri::{AppHandle};

use crate::database::game_match::game_commands::GameUpdate;

#[derive(serde::Serialize, Clone)]
struct InitPayload {
    team_a_id: i32,
    team_b_id: i32,
}

#[derive(serde::Serialize, Clone)]
struct UpdatePayload<'a> {
    team_id: i64,
    configuration: &'a GameUpdate,
    score_points: i64,
}

#[tauri::command]
pub async fn open_spectator_window(handle: AppHandle) {
    std::thread::spawn(move || {
        let _ = tauri::WindowBuilder::new(
            &handle,
            "spectator",
            tauri::WindowUrl::App("/match-mirror".into()),
        ).build()
            .unwrap_or_else(|error| {
                panic!("{}", error)
            });
    });
}
