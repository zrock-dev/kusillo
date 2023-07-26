use std::sync::mpsc::{channel, Receiver, Sender};
use std::sync::Mutex;

use lazy_static::lazy_static;
use tauri::{AppHandle, command};

use crate::game_match::clock::clock_manager::{ClockCommand, launch_clock_sync_thread, launch_clock_thread, Time};

lazy_static! {
    pub static ref CLOCK_COMMAND_SENDER: Mutex<Sender<ClockCommand>> = Mutex::new(channel().0);
}

#[command]
pub fn create_clock(handle: AppHandle) {
    let (time_sync_sender, time_sync_receiver): (Sender<Time>, Receiver<Time>) = channel();
    let (clock_command_sender, clock_command_receiver): (Sender<ClockCommand>, Receiver<ClockCommand>) = channel();
    *CLOCK_COMMAND_SENDER.lock().unwrap() = clock_command_sender;

    std::thread::spawn(move || {
        launch_clock_thread(time_sync_sender, clock_command_receiver);
    });

    std::thread::spawn(move || {
        launch_clock_sync_thread(handle, time_sync_receiver);
    });

}

#[command]
pub fn pause_clock(){
    CLOCK_COMMAND_SENDER.lock().unwrap().send(ClockCommand::Pause).unwrap();
}

#[command]
pub fn start_clock(){
    CLOCK_COMMAND_SENDER.lock().unwrap().send(ClockCommand::Start).unwrap();
}

#[command]
pub fn request_current_time() -> Time{
    let (reply_sender, reply_receiver) = channel();
    CLOCK_COMMAND_SENDER.lock().unwrap().send(ClockCommand::GetCurrentTime(reply_sender)).unwrap();
    reply_receiver.recv().unwrap()
}

pub fn restart_clock(){
    CLOCK_COMMAND_SENDER.lock().unwrap().send(ClockCommand::Restart).unwrap();
}

pub fn terminate_clock(){
    CLOCK_COMMAND_SENDER.lock().unwrap().send(ClockCommand::Terminate).unwrap();
}
