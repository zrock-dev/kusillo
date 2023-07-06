// use surrealdb::engine::remote::ws::Ws;
// use surrealdb::opt::auth::Root;
// use surrealdb::sql::Thing;
// use surrealdb::Surreal;

use crate::registration::player_repository::PlayersRepository;
use crate::registration::team_builder::TeamBuilder;

#[derive(Debug)]
pub struct TeamRegistrator{
    team_builder: TeamBuilder,
    players_repository: PlayersRepository,
}

impl TeamRegistrator{
    pub fn new() -> Self{
        TeamRegistrator{
            team_builder: TeamBuilder::new(),
            players_repository: PlayersRepository::new()
        }
    }

    pub fn save_player(&mut self, first_name: &str, last_name: &str){
       self.players_repository.register_player(first_name.to_string(), last_name.to_string());
    }

    pub fn set_category(&mut self, category: &str){
       self.team_builder.category(category);
    }

    pub fn set_name(&mut self, name: &str){
       self.team_builder.name(name.to_string());
    }

    pub fn store(&mut self){
        if self.players_repository.size() >= 2 || self.players_repository.size() <= 3{
            self.team_builder.players(self.players_repository.export());
            self.persist_store()
        }else {
            panic!("The size {} is incorrect", self.players_repository.size())
        }
    }

    fn persist_store(&mut self){
        dbg!(self.team_builder.build());
    }
}