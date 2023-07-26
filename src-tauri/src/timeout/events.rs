use tauri::{AppHandle, Manager};

pub fn fire_timeout_status_event(handle: AppHandle, status: bool){
    handle.emit_all("timeout_status", status).unwrap();
}