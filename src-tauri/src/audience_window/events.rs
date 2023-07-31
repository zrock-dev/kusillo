use tauri::{AppHandle, Manager};

use crate::audience_window::utils::AUDIENCE_WINDOW_NAME;
use crate::errors::Error;

pub fn fire_sync_event(handle: &AppHandle) -> Result<(), Error> {
    handle.emit_to(AUDIENCE_WINDOW_NAME, "audience_window_sync", ())?;
    Ok(())
}