use crate::registration::data::Player;
use tauri::{command};

#[command]
pub fn add(name: &str, last_name: &str){
    // store to db

    let player = Player{
        first_name: String::from(name),
        last_name: String::from(last_name)
    };
    dbg!(player);
}