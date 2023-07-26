use rusqlite::Connection;
use crate::database::game_match_actions::{record_winner, retrieve_contenders, retrieve_game_value, retrieve_score_value};
use crate::errors::Error;

pub fn get_max_score(game_set: i64) -> i64 {
    if game_set < 2 {
        20
    } else {
        18
    }
}

pub fn is_stage_won(connection: &Connection, game_id: i64, team_id: i64) -> Result<bool, Error>{
    let score = retrieve_score_value(&connection, "score_points", &game_id, &team_id)?;
    let game_set = retrieve_game_value(&connection, "set_number", &game_id)?;
    let max_score = get_max_score(game_set);

    if max_score == score {
        Ok(true)
    } else {
        let on_time = retrieve_game_value(&connection, "on_time", &game_id)?;
        return Ok(on_time == 0)
    }
}

pub fn is_stage_won_on_timeout(connection: &Connection, game_id: i64) -> Result<(i64, bool), Error>{
    let contenders = retrieve_contenders(&connection, &game_id).unwrap();
    let team_a_id = contenders.team_a_id;
    let team_b_id = contenders.team_b_id;
    let score_a = retrieve_score_value(&connection, "score_points", &game_id, &team_a_id).unwrap();
    let score_b = retrieve_score_value(&connection, "score_points", &game_id, &team_b_id).unwrap();

    let mut result = false;
    let mut winner_id = 0;

    if score_b != score_a {
        if score_a > score_b {
            winner_id = team_a_id;
        } else {
            winner_id = team_b_id;
        }
        result = true;
    }

    Ok((winner_id, result))
}

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

pub fn attempt_record_winner(connection: &Connection, game_id: i64, value: i64) -> Result<bool, Error>{
    if value > -1 {
        record_winner(connection, &game_id, &value)?;
        return Ok(true)
    }

    Ok(false)
}