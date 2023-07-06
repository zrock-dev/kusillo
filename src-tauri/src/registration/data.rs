use serde::{Deserialize};

#[derive(Debug, Deserialize, Copy, Clone)]
pub enum Categories {
    First,
    Second,
}

#[derive(Debug, Deserialize, Clone)]
pub struct Player {
    pub first_name: String,
    pub last_name: String,
}

#[derive(Debug, Deserialize)]
pub struct Team {
    pub name: String,
    pub players: Vec<Player>,
    pub category: Categories,
}
