use tauri::Manager;
use crate::clock::clock_manager::Time;

pub fn fire_event_time_sync(time: &Time, handle: tauri::AppHandle){
    handle.emit_all("time-sync", time).unwrap()
}
