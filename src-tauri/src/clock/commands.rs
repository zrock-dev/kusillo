use std::sync::mpsc::{channel, Receiver, Sender};
use std::sync::Mutex;

use lazy_static::lazy_static;
use tauri::{AppHandle, command};
use crate::clock::clock_manager::{ClockCommand, launch_clock_thread, Time};

lazy_static! {
    pub static ref CLOCK_COMMAND_SENDER: Mutex<Sender<ClockCommand>> = Mutex::new(channel().0);
}

#[command]
pub fn create_clock(handle: AppHandle) {
    let (clock_command_sender, clock_command_receiver): (Sender<ClockCommand>, Receiver<ClockCommand>) = channel();
    *CLOCK_COMMAND_SENDER.lock().unwrap() = clock_command_sender;

    std::thread::spawn(move || {
        launch_clock_thread(handle, clock_command_receiver);
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

pub fn reset_clock(){
    CLOCK_COMMAND_SENDER.lock().unwrap().send(ClockCommand::Reset).unwrap();
}

pub fn stop_clock(){
    CLOCK_COMMAND_SENDER.lock().unwrap().send(ClockCommand::Stop).unwrap();
}
