use rusqlite::Connection;
use crate::utils::rusqlite_error::Error;

pub fn get_score_color(score_points: i64) -> String{
    match score_points {
        points if points < 16 => String::from("white"),
        points if points == 16 => String::from("orange"),
        points if points == 17 => String::from("pink"),
        points if points == 18 => String::from("red"),
        _ => panic!()
    }
}

pub fn get_max_score(set_number: i64) -> i64{
    match set_number {
        number if number < 3 && number > 0 => 20,
        number if number == 3 => 18,
        _ => panic!()
    }
}

pub fn record_winner(connection: &Connection, team_id: &i64, match_id: &i64) -> Result<(), Error>{
    connection.execute(
        "INSERT INTO winners VALUES (?1, ?2)",
        [match_id, team_id]
    )?;
    
    Ok(())
}

pub fn get_set_number(connection: &Connection, team_id: &i64, match_id: &i64) -> Result<i64, Error>{
    let set_number = connection.query_row_and_then(
        "SELECT set_number FROM score WHERE match_id = ?1 AND team_id = ?2 ORDER BY rowid DESC LIMIT 1",
        [match_id, team_id],
        |row| {
            Ok::<i64, Error>(
                row.get(0)?
            )
        },
    )?;

    Ok(set_number)
}
