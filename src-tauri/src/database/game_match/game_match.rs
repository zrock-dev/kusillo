use rusqlite::Connection;

use crate::database::game_match::utils::{record, retrieve_contenders, retrieve_game_set, retrieve_score_value};
use crate::database::game_match::verifications::{at_three, at_two, verify_help};
use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;
use crate::utils::rusqlite_error::Error;

pub fn check_for_game_won(game_id: i64) -> Result<bool, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    let contenders = retrieve_contenders(&connection, &game_id)?;
    let team_a_id = contenders.team_a_id;
    let team_b_id = contenders.team_b_id;
    let game_set = retrieve_game_set(&connection, &game_id)?;

    let team_a_set_number = retrieve_score_value(&connection,"set_number", &game_id, &team_a_id)?;
    let team_b_set_number = retrieve_score_value(&connection,"set_number", &game_id, &team_b_id)?;

    println!("--------------------------GAME ID: {}------------------------------------", game_id);
    println!("SET: {}", game_set);
    println!("Team A set number: {} \nTeam B set number: {}", team_a_set_number, team_b_set_number);
    println!("----------------------------------------------------------------------------------");

    match game_set {
        1 => Ok(false),
        2 => {
            let value = at_two(team_a_set_number, team_b_set_number);
            Ok(verify_help(&connection, game_id, value)?)
        }
        3 => {
            let value = at_three(team_a_set_number, team_b_set_number);
            Ok(verify_help(&connection, game_id, value)?)
        }
        _ => panic!("Unexpected game set #{}", game_set)
    }
}

pub fn update_team_set(connection: &Connection, team_id: &i64, game_id: &i64) -> Result<i64, Error> {
    let tmp_set_number = retrieve_score_value(&connection,"set_number", &game_id, &team_id)?;
    let set_number = tmp_set_number + 1;

    println!("\nSET UPDATE | Game ID: {} | TEAM ID {}\nFROM {} -> {}", game_id, team_id, tmp_set_number, set_number);
    record(&connection, &game_id, &team_id, &0, &set_number)?;

    Ok(set_number)
}

pub fn get_max_score(game_set: i64) -> i64{
    if game_set < 2 {
        20
    }else {
        18
    }
}

pub fn get_score_color(score_points: i64) -> String{
    match score_points {
        points if points < 16 => String::from("blue"),
        points if points == 16 => String::from("orange"),
        points if points == 17 => String::from("pink"),
        points if points >= 18 => String::from("red"),
        _ => panic!("Score {} is outside of bounds", score_points)
    }
}
