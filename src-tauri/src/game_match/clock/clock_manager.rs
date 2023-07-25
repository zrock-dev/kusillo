use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;
use std::sync::mpsc::{Sender, Receiver};

pub struct Time {
    pub minutes: i32,
    pub seconds: i32,
}

#[derive(Debug)]
enum ClockCommand {
    Start,
    Pause,
    Terminate,
}

fn launch_clock(general_minutes: Arc<Mutex<i32>>, general_seconds: Arc<Mutex<i32>>, running: Arc<Mutex<bool>>){
    thread::spawn(move || {
        let mut minutes = *general_minutes.lock().unwrap();
        let mut seconds = *general_seconds.lock().unwrap();

        loop {
            thread::sleep(Duration::from_millis(999));
            if !*running.lock().unwrap() {
                println!("Stopping clock");
                break
            }
            seconds += 1;
            if seconds == 60 {
                minutes += 1;
                seconds = 0;
            }

            let time = Time {
                minutes,
                seconds
            };
            println!("current time is {}:{}", time.minutes, time.seconds);

            if !*running.lock().unwrap() {
                println!("Stopping clock");
                break
            }
        }
        *general_minutes.lock().unwrap() = minutes;
        *general_seconds.lock().unwrap() = seconds;
    });
}

fn clock(sender: Sender<Time>, receiver: Receiver<ClockCommand>) {
    thread::spawn(move || {
        let minutes = Arc::new(Mutex::new(0));
        let seconds = Arc::new(Mutex::new(0));

        let running = Arc::new(Mutex::new(false));
        loop {
            let command = receiver.recv().unwrap();
            match command {
                ClockCommand::Start => {
                    println!("Received start command");
                    *running.lock().unwrap() = true;
                    launch_clock(Arc::clone(&minutes), Arc::clone(&seconds), Arc::clone(&running))
                },

                ClockCommand::Pause => {
                    *running.lock().unwrap() = false;
                    println!("Received pause command");
                },

                ClockCommand::Terminate => {
                    *running.lock().unwrap() = false;
                    println!("Received terminate command");
                    break;
                }
            }
        }
        println!("The clock has terminated");
    });
}
