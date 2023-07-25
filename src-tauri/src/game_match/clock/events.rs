use tauri::AppHandle;
use crate::game_match::clock::clock_manager::Time;

pub fn fire_event_time_sync(time: &Time, handle: &AppHandle){
    handle.emit_all("time-sync", time).unwrap()
}

pub fn fire_event_timeout(handle: &AppHandle){
    handle.emit_all("time-out", ()).unwrap()
}