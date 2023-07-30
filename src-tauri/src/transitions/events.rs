use serde::Serialize;
use tauri::{AppHandle, Manager};
use crate::errors::Error;

#[derive(Clone, Serialize)]
pub struct StageDialogPayload {
    pub status: bool,
    pub team_name: Option<String>,
    pub game_set: Option<i64>
}


#[derive(Clone, Serialize)]
pub struct GameDialogPayload {
    pub status: bool,
    pub winner_name: Option<String>,
}


pub fn fire_stage_dialog_update_event(handle: &AppHandle, payload: StageDialogPayload) -> Result<(), Error> {
    handle.emit_all("stage_dialog_status", payload)?;
    Ok(())
}

pub fn fire_game_dialog_update_event(handle: &AppHandle, payload: GameDialogPayload) -> Result<(), Error> {
    handle.emit_all("game_dialog_status", payload)?;
    Ok(())
}
