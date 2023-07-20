use tauri::{Error, Window};
use tokio::runtime::Builder;
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
    score_points: i64
}

#[tauri::command]
pub async fn open_spectator_window(handle: tauri::AppHandle, team_a_id: i32, team_b_id: i32) -> Result<(), Error> {
    let spectator_window = tauri::WindowBuilder::new(
        &handle,
        "spectator",
        tauri::WindowUrl::App("/match-mirror".into()),
    ).build()?;

    let init_payload = InitPayload {
        team_a_id,
        team_b_id,
    };

    spectator_window.emit("mirror_init", init_payload)?;

    Ok(())
}

pub fn update_spectator_window(window: Window, configuration: &Configuration, team_id: i64, score_points: i64) -> Result<(), Error> {
    let rt = Builder::new_current_thread().enable_all().build()?;
    rt.block_on(async {
        let update_payload = UpdatePayload {
            team_id,
            configuration,
            score_points,
        };
        window.emit("mirror_update", update_payload)?;
        Ok(())
    })
}