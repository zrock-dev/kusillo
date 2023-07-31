use std::convert::Into;
use tauri::{AppHandle, command};
use crate::audience_window::events::fire_sync_event;
use crate::audience_window::utils::{AUDIENCE_WINDOW_NAME, window_already_exists};
use crate::errors::Error;

#[command]
pub async fn open_audience_window(handle: AppHandle){
    std::thread::spawn(move || {
        let _ = tauri::WindowBuilder::new(
            &handle,
            AUDIENCE_WINDOW_NAME,
            tauri::WindowUrl::App("/audience_window".into()),
        ).build()
            .unwrap_or_else(|error| {
                panic!("{:?}", error)
            });
    });
}

#[command]
pub fn check_on_audience_window(handle: AppHandle) -> Result<(), Error>{
    fire_sync_event(&handle)?;
    Ok(())
}

#[command]
pub fn is_audience_window_open(handle: AppHandle) -> Result<bool, Error>{
   Ok(window_already_exists(&handle, AUDIENCE_WINDOW_NAME))
}