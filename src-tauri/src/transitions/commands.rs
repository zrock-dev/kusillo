use tauri::{AppHandle, command};
use crate::clock::commands::start_clock;
use crate::errors::Error;
use crate::transitions::events::{fire_game_dialog_update_event, fire_stage_dialog_update_event, GameDialogPayload, StageDialogPayload};

#[command]
pub fn request_game_dialog_close(handle: AppHandle) -> Result<(), Error> {
    let payload = GameDialogPayload {
        status: false,
        winner_name: None,
    };

    fire_game_dialog_update_event(&handle, payload)?;
    Ok(())
}

#[command]
pub fn request_stage_dialog_close(handle: AppHandle) -> Result<(), Error> {
    let payload = StageDialogPayload {
        status: false,
        team_name: None,
        game_set: None,
    };

    fire_stage_dialog_update_event(&handle, payload)?;
    start_clock();
    Ok(())
}
