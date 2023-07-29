use std::sync::{Arc, Mutex};
use std::sync::mpsc::{channel, Receiver, Sender};
use std::thread;
use std::time::Duration;

use serde::Serialize;
use tauri::AppHandle;

use crate::clock::utils::{launch_clock_sync_thread, SyncCommands};

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

fn start_counter(minutes: Arc<Mutex<i32>>, seconds: Arc<Mutex<i32>>, running: Arc<Mutex<bool>>, sender: Sender<SyncCommands>) {
    loop {
        thread::sleep(Duration::from_millis(1000));
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
        sender.send(SyncCommands::TimeUpdate(time)).unwrap();
    }
}

pub fn launch_clock_thread(handle: AppHandle, receiver: Receiver<ClockCommand>) {
    let minutes = Arc::new(Mutex::new(0));
    let seconds = Arc::new(Mutex::new(0));

    let (time_sync_sender, time_sync_receiver): (Sender<SyncCommands>, Receiver<SyncCommands>) = channel();
    let clock_sync_thread = thread::spawn(move || {
        launch_clock_sync_thread(handle, time_sync_receiver)
    });

    let mut clock_counter_thread: Option<thread::JoinHandle<()>> = None;
    let is_counter_running = Arc::new(Mutex::new(false));

    loop {
        match receiver.recv() {
            Ok(command) => {
                match command {
                    ClockCommand::Start => {
                        if !*is_counter_running.lock().unwrap() {
                            *is_counter_running.lock().unwrap() = true;

                            let minutes = Arc::clone(&minutes);
                            let seconds = Arc::clone(&seconds);
                            let running = Arc::clone(&is_counter_running);
                            let sender = time_sync_sender.clone();

                            clock_counter_thread = Some(thread::spawn(move || {
                                start_counter(minutes, seconds, running, sender)
                            }));

                        }
                    }

                    ClockCommand::Pause => {
                        *is_counter_running.lock().unwrap() = false;
                        if let Some(thread) = clock_counter_thread.take() {
                            thread.join().unwrap();
                        }
                    }

                    ClockCommand::Reset => {
                        *minutes.lock().unwrap() = 0;
                        *seconds.lock().unwrap() = 0;

                        time_sync_sender.send(SyncCommands::TimeUpdate(
                            Time {
                                minutes: *minutes.lock().unwrap(),
                                seconds: *seconds.lock().unwrap(),
                            }
                        )).unwrap();
                    }

                    ClockCommand::GetCurrentTime(reply_sender) => {
                        let time = Time {
                            minutes: *minutes.lock().unwrap(),
                            seconds: *seconds.lock().unwrap(),
                        };

                        reply_sender.send(time).unwrap();
                    }

                    ClockCommand::Stop => {
                        *is_counter_running.lock().unwrap() = false;
                        time_sync_sender.send(SyncCommands::Stop).unwrap();
                        clock_sync_thread
                            .join()
                            .expect("Clock Sync thread can't be joined");
                        break;
                    }
                }
            }
            Err(_) => { break; }
        }
    }
}

