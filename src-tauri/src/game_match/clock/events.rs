use crate::game_match::clock::clock_manager::Time;
use tauri::Manager;

pub fn fire_event_time_sync(time: &Time, handle: tauri::AppHandle){
    handle.emit_all("time-sync", time).unwrap()
}
