use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Copy, Clone, Serialize)]
pub enum Categories {
    First,
    Second,
}

#[derive(Debug, Deserialize, Clone, Serialize)]
pub struct Player {
    pub first_name: String,
    pub last_name: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Team {
    pub name: String,
    pub category: Categories,
}
