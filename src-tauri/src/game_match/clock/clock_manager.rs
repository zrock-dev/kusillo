use std::sync::{Arc, Mutex};
use std::sync::mpsc::{Receiver, Sender};
use std::thread;
use std::time::Duration;
use serde::Serialize;

use tauri::AppHandle;

use crate::game_match::clock::actions::{is_clock_on_time, record_timeout};
use crate::game_match::clock::commands::CLOCK_COMMAND_SENDER;
use crate::game_match::clock::events::{fire_event_time_sync, fire_event_timeout};

#[derive(Serialize)]
pub struct Time {
    pub minutes: i32,
    pub seconds: i32,
}

pub enum ClockCommand {
    Start,
    Pause,
    Terminate,
    GetCurrentTime(Sender<Time>),
}

fn start_counter(general_minutes: Arc<Mutex<i32>>, general_seconds: Arc<Mutex<i32>>, running: Arc<Mutex<bool>>, sender: Sender<Time>) {
    thread::spawn(move || {
        let mut minutes = *general_minutes.lock().unwrap();
        let mut seconds = *general_seconds.lock().unwrap();

        loop {
            thread::sleep(Duration::from_millis(50));
            if !*running.lock().unwrap() {
                println!("Stopping clock");
                break;
            }

            seconds += 1;
            if seconds == 60 {
                minutes += 1;
                seconds = 0;
            }

            let time = Time {
                minutes,
                seconds,
            };
            sender.send(time).unwrap();
        }

        *general_minutes.lock().unwrap() = minutes;
        *general_seconds.lock().unwrap() = seconds;
    });
}

pub fn launch_clock_thread(time_sync_sender: Sender<Time>, receiver: Receiver<ClockCommand>) {
    let minutes = Arc::new(Mutex::new(0));
    let seconds = Arc::new(Mutex::new(0));

    let running = Arc::new(Mutex::new(false));
    loop {
        let command = receiver.recv().unwrap();
        match command {
            ClockCommand::Start => {
                println!("Received start command");
                *running.lock().unwrap() = true;
                start_counter(Arc::clone(&minutes), Arc::clone(&seconds), Arc::clone(&running), time_sync_sender.clone())
            }

            ClockCommand::Pause => {
                *running.lock().unwrap() = false;
                println!("Received pause command");
            }

            ClockCommand::Terminate => {
                *running.lock().unwrap() = false;
                println!("Received terminate command");
                break;
            }

            ClockCommand::GetCurrentTime(reply_sender) => {
                let time = Time {
                    minutes: *minutes.lock().unwrap(),
                    seconds: *seconds.lock().unwrap(),
                };

                reply_sender.send(time).unwrap();
            }
        }
    }
    println!("The clock has terminated");
}

pub fn launch_clock_sync_thread(handle: AppHandle, time_sync_receiver: Receiver<Time>){
    loop {
        let time = time_sync_receiver.recv().unwrap();
        fire_event_time_sync(&time, handle.clone());
        if !is_clock_on_time(&time) {
            CLOCK_COMMAND_SENDER.lock().unwrap().send(ClockCommand::Terminate).unwrap();
            fire_event_timeout(handle.clone());
            record_timeout();
        }
    }
}

