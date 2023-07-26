use rusqlite::Connection;
use crate::database::game_match::utils::record_winner;
use crate::game_match::clock::commands::{pause_clock, restart_clock, terminate_clock};
use crate::utils::rusqlite_error::Error;

pub fn at_three(team_a_set: i64, team_b_set: i64) -> i64 {
    if team_a_set == 2 {
        team_a_set
    }else if team_b_set == 2 {
        team_b_set
    }else {
        -1
    }
}

pub fn at_two(team_a_set: i64, team_b_set: i64) -> i64 {
    if team_a_set == 2 && team_b_set == 0 {
        team_a_set
    } else if team_b_set == 2 && team_a_set == 0 {
        team_b_set
    } else {
        -1
    }
}

pub fn verify_help(connection: &Connection, game_id: i64, value: i64) -> Result<bool, Error>{
   if value == -1 {
      Ok(false)
   }else {
       record_winner(connection, &game_id, &value)?;
       terminate_clock();
       Ok(true)
   }
}