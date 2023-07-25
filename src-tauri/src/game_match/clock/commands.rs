use std::sync::mpsc::{channel, Receiver, Sender};
use tauri::{AppHandle, command};
use crate::game_match::clock::clock_manager::{ClockCommand, launch_clock_sync_thread, launch_clock_thread, Time};

#[command]
pub fn create_clock(handle: AppHandle<>) {
    let (time_sync_sender, time_sync_receiver): (Sender<Time>, Receiver<Time>) = channel();
    let (clock_command_sender, clock_command_receiver): (Sender<ClockCommand>, Receiver<ClockCommand>) = channel();

    std::thread::spawn(move || {
        launch_clock_thread(time_sync_sender, clock_command_receiver);
    });

    std::thread::spawn(move || {
        launch_clock_sync_thread(handle, time_sync_receiver, clock_command_sender);
    });
}

#[command]
pub fn pause_clock(){
    let (clock_command_sender, clock_command_receiver): (Sender<ClockCommand>, Receiver<ClockCommand>) = channel();
    clock_command_sender.send(ClockCommand::Pause).unwrap();
}

#[command]
pub fn start_clock(){
    let (clock_command_sender, clock_command_receiver): (Sender<ClockCommand>, Receiver<ClockCommand>) = channel();
    clock_command_sender.send(ClockCommand::Start).unwrap();
}

#[command]
pub fn request_current_time() -> Time{
    let (clock_command_sender, clock_command_receiver): (Sender<ClockCommand>, Receiver<ClockCommand>) = channel();
    let (reply_sender, reply_receiver) = channel();
    clock_command_sender.send(ClockCommand::GetCurrentTime(reply_sender)).unwrap();
    reply_receiver.recv().unwrap()
}
