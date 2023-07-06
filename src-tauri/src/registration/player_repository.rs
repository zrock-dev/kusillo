use crate::registration::data::Player;

#[derive(Debug)]
pub struct PlayersRepository {
    players: Vec<Player>,
}

impl PlayersRepository {
    pub fn new() -> Self{
        PlayersRepository{
            players: Vec::new()
        }
    }

    pub fn register_player(&mut self, first_name: String, last_name: String){
        self.players.push(Player{
            first_name,
            last_name,
        })
    }

    pub fn size(&mut self) -> usize{
        return self.players.len()
    }

    pub fn export(&self) -> &Vec<Player>{
        &self.players
    }
}