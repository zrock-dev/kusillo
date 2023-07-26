use tauri::{AppHandle, command};
use crate::timeout::events::fire_timeout_status_event;

#[command]
pub fn request_timeout(handle: AppHandle){
    fire_timeout_status_event(handle, true)
}

#[command]
pub fn request_timeout_finish(handle: AppHandle){
    fire_timeout_status_event(handle, false)
}
