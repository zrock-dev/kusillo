use rusqlite::Connection;
use tauri::AppHandle;
use crate::database::game_match::events::publish_game_update;
use crate::database::game_match::game_commands::GameUpdate;
use crate::database::game_match::game_match::{check_for_game_won, update_team_set};

use crate::database::game_match::utils::{retrieve_contenders, retrieve_game_value, retrieve_latest_game_id, retrieve_score_value, update_game_set, update_game_value};
use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;
use crate::game_match::clock::clock_manager::Time;
use crate::game_match::clock::commands::restart_clock;

pub fn is_clock_on_time(time: &Time) -> bool {
    let connection = Connection::open(PERM_TEAM_PLAYERS).unwrap();
    let game_id = retrieve_latest_game_id(&connection).unwrap();
    let game_set = retrieve_game_value(&connection, "set_number", &game_id).unwrap();

    if game_set < 2 {
        time.minutes <= 19
    } else {
        time.minutes <= 14
    }
}

pub fn handle_timeout(handle: &AppHandle) {
    let connection = Connection::open(PERM_TEAM_PLAYERS).unwrap();
    let game_id = retrieve_latest_game_id(&connection).unwrap();
    update_game_value(&connection, &game_id, "on_time", 0).unwrap();

    let contenders = retrieve_contenders(&connection, &game_id).unwrap();
    let team_a_id = contenders.team_a_id;
    let team_b_id = contenders.team_b_id;
    let score_a = retrieve_score_value(&connection, "score_points", &game_id, &team_a_id).unwrap();
    let score_b = retrieve_score_value(&connection, "score_points", &game_id, &team_b_id).unwrap();

    if score_b != score_a {
        if score_a > score_b {
            update_game(&connection, team_a_id, game_id, handle);
        } else {
            update_game(&connection, team_b_id, game_id, handle);
        }
    }
}

fn update_game(connection: &Connection, team_id: i64, game_id: i64, handle: &AppHandle){
    let current_stage = update_team_set(&connection, &team_id, &game_id).unwrap();
    update_game_set(&connection, &game_id).unwrap();
    restart_clock();
    let is_game_won = check_for_game_won(game_id).unwrap();

    let configuration = GameUpdate{
        score_color: String::from("blue"),
        current_stage,
        is_game_won,
        is_stage_won: true,
    };

    publish_game_update(handle, configuration, team_id, 0).unwrap();
}
