use crate::registration::data::{Player, Categories, Team};

#[derive(Debug)]
pub struct TeamBuilder{
    name: String,
    players: Vec<Player>,
    category: Categories
}

impl TeamBuilder{
    pub fn new() -> Self{
       TeamBuilder{
           name: String::from(""),
           players: Vec::new(),
           category: Categories::First
       }
    }

    pub fn players(&mut self, players: &Vec<Player>) -> &Self {
        self.players = players.clone();
        self
    }

    pub fn name(&mut self, name: String) -> &Self {
        self.name = name;
        self
    }

    pub fn category(&mut self, category: &str) -> &Self {
        self.category = match category {
            "First" => Categories::First,
            "Second" => Categories::Second,
            _ => panic!("Provided category {} is invalid", category),
        };
        self
    }

    pub fn build(&mut self) -> Team {
        Team {
            name: String::from(&self.name),
            category: self.category,
            players: self.players.clone(),
        }
    }
}
