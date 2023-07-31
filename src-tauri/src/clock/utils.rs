use std::sync::mpsc::Receiver;
use rusqlite::Connection;
use tauri::AppHandle;
use crate::clock::actions::{handle_timeout, is_clock_on_time};
use crate::clock::clock_manager::Time;
use crate::clock::commands::pause_clock;
use crate::clock::events::fire_event_time_sync;
use crate::database::game_match::actions::retrieve_latest_game_id;
use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;

pub enum SyncCommands {
    TimeUpdate(Time),
    Stop,
}

pub fn launch_clock_sync_thread(handle: AppHandle, time_sync_receiver: Receiver<SyncCommands>) {
    let connection = Connection::open(PERM_TEAM_PLAYERS).unwrap();
    let game_id = retrieve_latest_game_id(&connection).unwrap();
    let mut old_minute = 0;

    loop {
        match time_sync_receiver.recv() {
            Ok(command) => {
                match command {
                    SyncCommands::TimeUpdate(time) => {
                        fire_event_time_sync(&time, handle.clone());
                        if old_minute != *&time.minutes {
                            old_minute = *&time.minutes;

                            if !is_clock_on_time(&connection, game_id, &time) {
                                old_minute = 0;
                                pause_clock();
                                handle_timeout(&handle);
                            }
                        }
                    }

                    SyncCommands::Stop => {
                       break;
                    }
                }
            }
            Err(_) => { break; }
        }
    }
}
