use rusqlite::Connection;

use crate::database::game_match::utils::{record_to_score_table, retrieve_contenders, retrieve_game_value, retrieve_score_value};
use crate::database::game_match::verifications::{at_three, at_two, verify_help};
use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;
use crate::utils::rusqlite_error::Error;

pub fn check_for_game_won(game_id: i64) -> Result<bool, Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    let contenders = retrieve_contenders(&connection, &game_id)?;
    let team_a_id = contenders.team_a_id;
    let team_b_id = contenders.team_b_id;
    let game_set = retrieve_game_value(&connection, "set_number", &game_id)?;

    let team_a_set_number = retrieve_score_value(&connection, "set_number", &game_id, &team_a_id)?;
    let team_b_set_number = retrieve_score_value(&connection, "set_number", &game_id, &team_b_id)?;

    match game_set {
        1 => Ok(false),
        2 => {
            let help_value = at_two(team_a_set_number, team_b_set_number);
            Ok(verify_help(&connection, game_id, help_value)?)
        }
        3 => {
            let help_value = at_three(team_a_set_number, team_b_set_number);
            Ok(verify_help(&connection, game_id, help_value)?)
        }
        _ => panic!("Unexpected game set #{}", game_set)
    }
}

pub fn update_team_set(connection: &Connection, team_id: &i64, game_id: &i64) -> Result<i64, Error> {
    let tmp_set_number = retrieve_score_value(&connection, "set_number", &game_id, &team_id)?;
    let set_number = tmp_set_number + 1;

    record_to_score_table(&connection, &game_id, &team_id, &0, &set_number)?;
    Ok(set_number)
}

pub fn get_max_score(game_set: i64) -> i64 {
    if game_set < 2 {
        20
    } else {
        18
    }
}

pub fn get_score_color(score_points: i64) -> String {
    match score_points {
        points if points < 16 => String::from("blue"),
        points if points == 16 => String::from("orange"),
        points if points == 17 => String::from("pink"),
        points if points >= 18 => String::from("red"),
        _ => panic!("Score {} is outside of bounds", score_points)
    }
}

pub fn check_for_stage_won(game_id: &i64, max_score: i64, score_points: &i64) -> Result<bool, Error> {
    if max_score == *score_points {
        Ok(true)
    } else {
        let connection = Connection::open(PERM_TEAM_PLAYERS)?;
        let on_time = retrieve_game_value(&connection, "on_time", &game_id)?;

        if on_time == 0 {
            let contenders = retrieve_contenders(&connection, &game_id)?;
            let team_a_id = contenders.team_a_id;
            let team_b_id = contenders.team_b_id;
            let score_a = retrieve_score_value(&connection, "score_points", &game_id, &team_a_id)?;
            let score_b = retrieve_score_value(&connection, "score_points", &game_id, &team_b_id)?;

            return Ok(score_a == score_b)
        } else {
            Ok(false)
        }
    }
}
