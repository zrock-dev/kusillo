use rusqlite::Connection;
use crate::utils::rusqlite_error::Error;

pub fn get_score_color(score_points: i64) -> String{
    match score_points {
        points if points < 16 => String::from("white"),
        points if points == 16 => String::from("orange"),
        points if points == 17 => String::from("pink"),
        points if points >= 18 => String::from("red"),
        _ => panic!("Score {} is outside of bounds", score_points)
    }
}

pub fn get_max_score(game_set: i64) -> i64{
    match game_set {
        number if number < 3 && number >= 0 => 20,
        number if number == 3 => 18,
        _ => panic!("Set #{} outside of bounds", game_set)
    }
}

pub fn record_winner(connection: &Connection, game_id: &i64, team_id: &i64) -> Result<(), Error>{
    connection.execute(
        "INSERT INTO winners VALUES (?1, ?2)",
        [game_id, team_id]
    )?;
    Ok(())
}

pub fn get_set_number(connection: &Connection, game_id: &i64, team_id: &i64) -> Result<i64, Error>{
    let set_number = connection.query_row_and_then(
        "SELECT set_number FROM score WHERE game_id = ?1 AND team_id = ?2 ORDER BY rowid DESC LIMIT 1",
        [game_id, team_id],
        |row| {
            Ok::<i64, Error>(
                row.get(0)?
            )
        },
    )?;

    Ok(set_number)
}

pub fn get_game_set(connection: &Connection, game_id: &i64) -> Result<i64, Error>{
    let set_number = connection.query_row_and_then(
        "SELECT set_number FROM game WHERE rowid = ?1",
        [game_id],
        |row| {
            Ok::<i64, Error>(
                row.get(0)?
            )
        },
    )?;
    Ok(set_number)
}

pub fn cash_game_set(connection: &Connection, &game_id: &i64) -> Result<(), Error>{
   let set_number  = get_game_set(connection, &game_id)?;
    if set_number > 3 {
        panic!("The game set #{} is outside of bounds", set_number)
    }
    connection.execute(
        "UPDATE game SET set_number = ?1 WHERE rowid = ?2",
        [set_number + 1, game_id]
    )?;

    Ok(())
}
