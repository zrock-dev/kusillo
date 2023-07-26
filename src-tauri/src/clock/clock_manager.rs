use std::sync::{Arc, Mutex};
use std::sync::mpsc::{Receiver, Sender};
use std::thread;
use std::time::Duration;

use serde::Serialize;
use tauri::AppHandle;
use crate::clock::actions::{handle_timeout, is_clock_on_time};
use crate::clock::commands::pause_clock;
use crate::clock::events::fire_event_time_sync;

#[derive(Serialize)]
pub struct Time {
    pub minutes: i32,
    pub seconds: i32,
}

pub enum ClockCommand {
    Start,
    Pause,
    Reset,
    Stop,
    GetCurrentTime(Sender<Time>),
}

fn start_counter(minutes: Arc<Mutex<i32>>, seconds: Arc<Mutex<i32>>, running: Arc<Mutex<bool>>, sender: Sender<Time>) {
    thread::spawn(move || {
        loop {
            thread::sleep(Duration::from_millis(50));
            if !*running.lock().unwrap() {
                break;
            }

            *seconds.lock().unwrap() += 1;
            if *seconds.lock().unwrap() == 60 {
                *minutes.lock().unwrap() += 1;
                *seconds.lock().unwrap() = 0;
            }

            let time = Time {
                minutes: *minutes.lock().unwrap(),
                seconds: *seconds.lock().unwrap(),
            };
            sender.send(time).unwrap();
        }
    });
}

pub fn launch_clock_thread(time_sync_sender: Sender<Time>, receiver: Receiver<ClockCommand>) {
    let minutes = Arc::new(Mutex::new(0));
    let seconds = Arc::new(Mutex::new(0));

    let running = Arc::new(Mutex::new(false));
    loop {
        match receiver.recv() {
            Ok(command) => {
                match command {
                    ClockCommand::Start => {
                        *running.lock().unwrap() = true;
                        start_counter(Arc::clone(&minutes), Arc::clone(&seconds), Arc::clone(&running), time_sync_sender.clone());
                    }

                    ClockCommand::Pause => {
                        *running.lock().unwrap() = false;
                    }

                    ClockCommand::Reset => {
                        *minutes.lock().unwrap() = 0;
                        *seconds.lock().unwrap() = 0;

                        time_sync_sender.send(Time {
                            minutes: *minutes.lock().unwrap(),
                            seconds: *seconds.lock().unwrap(),
                        }).unwrap();
                    }

                    ClockCommand::GetCurrentTime(reply_sender) => {
                        let time = Time {
                            minutes: *minutes.lock().unwrap(),
                            seconds: *seconds.lock().unwrap(),
                        };

                        reply_sender.send(time).unwrap();
                    }

                    ClockCommand::Stop => {
                        *running.lock().unwrap() = false;
                        break;
                    }
                }
            }
            Err(_) => { break; }
        }
    }
}

pub fn launch_clock_sync_thread(handle: AppHandle, time_sync_receiver: Receiver<Time>) {
    loop {
        match time_sync_receiver.recv() {
            Ok(time) => {
                fire_event_time_sync(&time, handle.clone());
                if !is_clock_on_time(&time) {
                    pause_clock();
                    handle_timeout(&handle);
                }
            }
            Err(_) => { break; }
        }
    }
}

