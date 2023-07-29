use serde::Serialize;
use tauri::{AppHandle, Manager};

use crate::errors::Error;

#[derive(Clone, Serialize)]
pub struct ScoreUpdatePayload {
    pub team_id: i64,
    pub score: i64,
    pub score_color: String,
}

#[derive(Clone, Serialize)]
pub struct StageUpdatePayload {
    pub team_id: i64,
    pub stage_number: i64,
    pub max_score: i64,
}

#[derive(Clone, Serialize)]
pub struct GameUpdatePayload {
    pub winner_name: String,
}

pub fn fire_score_update_event(handle: &AppHandle, payload: ScoreUpdatePayload) -> Result<(), Error> {
    handle.emit_all("score_update", payload)?;
    Ok(())
}

pub fn fire_stage_update_event(handle: &AppHandle, payload: StageUpdatePayload) -> Result<(), Error> {
    handle.emit_all("stage_update", payload)?;
    Ok(())
}

pub fn fire_game_won_event(handle: &AppHandle, payload: GameUpdatePayload) -> Result<(), Error> {
    handle.emit_all("game_won", (payload))?;
    Ok(())
}


pub fn fire_stage_reset_event(handle: &AppHandle) -> Result<(), Error> {
    handle.emit_all("stage_reset", ())?;
    Ok(())
}
