use rusqlite::Connection;
use crate::database::game_match::actions::{Contender, Contenders, retrieve_contenders, retrieve_game_value, retrieve_score_value};
use crate::errors::Error;

pub fn get_max_score(game_set: i64) -> i64 {
    if game_set < 2 {
        18
    } else {
        16
    }
}

pub fn is_stage_won(connection: &Connection, game_id: i64, team_id: i64, is_up_button: bool) -> Result<bool, Error>{
    let score = retrieve_score_value(&connection, "score_points", &game_id, &team_id)?;
    let game_set = retrieve_game_value(&connection, "set_number", &game_id)?;
    let max_score = get_max_score(game_set);

    if max_score == score {
        Ok(true)
    } else {
        let on_time = retrieve_game_value(&connection, "on_time", &game_id)?;
        return Ok(on_time == 0 && is_up_button)
    }
}

pub fn is_stage_won_on_timeout(connection: &Connection, game_id: i64) -> Result<(i64, bool), Error>{
    let contenders = retrieve_contenders(&connection, &game_id).unwrap();
    let team_a_id = contenders.team_a.id;
    let team_b_id = contenders.team_b.id;

    let score_a = retrieve_score_value(&connection, "score_points", &game_id, &team_a_id)?;
    let score_b = retrieve_score_value(&connection, "score_points", &game_id, &team_b_id)?;

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

pub fn review_game(contenders: Contenders, game_set_number: i64) -> Option<Contender>{
    match game_set_number {
        2 => {
            at_two(contenders)
        }

        3 => {
            at_three(contenders)
        }

        _ => panic!("Cannot review the game at stage #{}", game_set_number)
    }
}

pub fn at_three(contenders: Contenders) -> Option<Contender> {
    let team_a = contenders.team_a;
    let team_b = contenders.team_b;

    if team_a.set_points == 2 {
        Some(team_a)
    }else if team_b.set_points == 2 {
        Some(team_a)
    }else {
        None
    }
}

pub fn at_two(contenders: Contenders) -> Option<Contender> {
    let team_a = contenders.team_a;
    let team_b = contenders.team_b;

    if team_a.set_points == 2 && team_b.set_points == 0 {
        Some(team_a)
    } else if team_b.set_points == 2 && team_a.set_points == 0 {
        Some(team_b)
    } else {
        None
    }
}
