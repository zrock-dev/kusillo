use tauri::{command};
use crate::registration::data::{Categories, Team};

#[command]
pub fn save_team(name: &str, category: &str){
    let category =  match category {
        "First" => Categories::First,
        "Second" => Categories::Second,
        _ => panic!("Provided category {} is invalid", category),
    };

    let team = Team{
        name: String::from(name),
        category,
    };
    dbg!(team);
}

#[command]
pub fn validate_category(category: &str) -> bool{
    let category =  match category {
        "First" => Categories::First,
        "Second" => Categories::Second,
        _ => panic!("Provided category {} is invalid", category),
    };

    true
}