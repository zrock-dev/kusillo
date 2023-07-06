use serde::{Deserialize};

#[derive(Debug, Deserialize)]
pub enum Categories {
    First,
    Second,
}

#[derive(Debug, Deserialize, Clone)]
pub struct Player<'a> {
    pub first_name: &'a str,
    pub last_name: &'a str,
}

#[derive(Debug, Deserialize)]
pub struct Team<'a> {
    pub name: &'a str,
    pub players: Vec<Player<'a>>,
    pub category: Categories,
}
