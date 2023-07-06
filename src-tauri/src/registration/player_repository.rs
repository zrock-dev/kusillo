use crate::registration::data::Player;

#[derive(Debug)]
pub struct PlayersRepository<'a> {
    players: Vec<Player<'a>>,
}

impl PlayersRepository<'_> {
    pub fn new() -> Self{
        PlayersRepository{
            players: Vec::new()
        }
    }

    pub fn register_player(&mut self, first_name: &str, last_name: &str){
        self.players.push(Player{
            first_name,
            last_name,
        })
    }

    pub fn size(&mut self) -> usize{
        return self.players.len()
    }

    pub fn export(&self) -> &Vec<Player<'_>>{
        &self.players
    }
}