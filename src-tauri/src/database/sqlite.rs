use rusqlite::{Connection, Error, Result};

fn create_teams_table(connection: &Connection) -> Result<usize>{
    connection.execute(
        "CREATE TABLE IF NOT EXISTS teams (
            id INTEGER PRIMARY KEY,
            name TEXT NULL,
            category TEXT NULL
        )", ())
}

fn create_players_table(connection: &Connection) -> Result<usize>{
    connection.execute(
        "CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY,
            team_id INTEGER,
            first_name TEXT NULL,
            last_name TEXT NULL,
            FOREIGN KEY (team_id) REFERENCES teams (id)
        )", ())
}

fn safe_connection<T>(result: Result<T, Error>){
    match result {
        Ok(_) => println!("Successful"),
        Err(error) => println!("Error: \n\t {}", error)
    }
}

pub fn startup() -> Result<()>{
    let connection = Connection::open("tournament_management.db");
    if connection.is_ok() {
        let connection = connection.unwrap();
        safe_connection(create_teams_table(&connection));
        safe_connection(create_players_table(&connection));
    }else {
        connection.expect("Could not load the database");
    }

    Ok(())
}


