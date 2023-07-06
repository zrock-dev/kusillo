use crate::registration::data::{Player, Categories, Team};

#[derive(Debug)]
pub struct TeamBuilder<'a>{
    name: &'a str,
    players: &'a Vec<Player<'a>>,
    category: Categories
}

impl TeamBuilder<'_>{
    pub fn new() -> Self{
       TeamBuilder{
           name: "",
           players: &Vec::new(),
           category: Categories::First
       }
    }

    pub fn players(&mut self, players: &Vec<Player>) -> &Self {
        self.players = players;
        &self
    }

    pub fn name(&mut self, name: &str) -> &Self {
        self.name = name;
        &self
    }

    pub fn category(&mut self, category: &str) -> &Self {
        self.category = match category {
            "First" => Categories::First,
            "Second" => Categories::Second,
            _ => panic!("Provided category {} is invalid", category),
        };
        &self
    }

    pub fn build(&self) -> Team {
        Team {
            name: self.name,
            category: self.category,
            players: self.players.clone(),
        }
    }
}
