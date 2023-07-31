use tauri::{AppHandle, Manager};

pub const AUDIENCE_WINDOW_NAME: &str = "audience";

pub fn window_already_exists(handle: &AppHandle, window_label: &str) -> bool{
    handle.windows().contains_key(window_label)
}