use tauri::{AppHandle, Error, Window};

use crate::database::game_match::game_commands::Configuration;

#[derive(serde::Serialize, Clone)]
struct InitPayload {
    team_a_id: i32,
    team_b_id: i32,
}

#[derive(serde::Serialize, Clone)]
struct UpdatePayload<'a> {
    team_id: i64,
    configuration: &'a Configuration,
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

pub fn update_spectator_window(window: Window, configuration: &Configuration, team_id: i64, score_points: i64) -> Result<(), Error> {
    let update_payload = UpdatePayload {
        team_id,
        configuration,
        score_points,
    };
    window.emit("mirror_update", update_payload)?;
    Ok(())
}
