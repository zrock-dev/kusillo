use lazy_static::lazy_static;
use polodb_core::Database;
use crate::registration::data::Team;
use std::sync::Mutex;


lazy_static!{
    static ref GLOBAL_DB: Mutex<Database> = Mutex::new(Database::open_memory().unwrap());
}

pub fn save(team: Team){
    let db = GLOBAL_DB.lock().unwrap();
    let mut session = db.start_session().unwrap();
    session.start_transaction(None).unwrap();

    let _ = db.create_collection("teams");
    let teams = db.collection("teams");
    let _ = teams.insert_one(team);

    session.commit_transaction().unwrap();
}

pub fn show_all_teams(){
    let db = GLOBAL_DB.lock().unwrap();
    let mut session = db.start_session().unwrap();
    session.start_transaction(None).unwrap();

    let collection = db.collection::<Team>("teams");
    let teams = collection.find(None).unwrap();

    for team in teams {
        println!("team found");
        dbg!(team).as_ref().expect("Panic in the disco");
    }
    session.commit_transaction().unwrap();
}