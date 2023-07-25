use rusqlite::Connection;
use tauri::Manager;

use crate::database::game_match::game_commands::GameUpdate;
use crate::database::game_match::game_match::{check_for_game_won, check_for_stage_won, get_score_color, update_team_set};
use crate::database::game_match::utils::{record_winner, retrieve_score_value, update_game_set};
use crate::database::registration::table_player_creation::PERM_TEAM_PLAYERS;
use crate::utils::rusqlite_error::Error;

#[derive(serde::Serialize, Clone)]
struct UpdatePayload {
    team_id: i64,
    configuration: GameUpdate,
    score_points: i64,
}

#[tauri::command]
pub fn fire_score_update(app_handle: tauri::AppHandle, game_id: i64, team_id: i64, max_score: i64) -> Result<(), Error> {
    let connection = Connection::open(PERM_TEAM_PLAYERS)?;
    let score_color;
    let mut current_stage;
    let mut is_game_won = false;
    let is_stage_won;

    let score_points = retrieve_score_value(&connection, "score_points", &game_id, &team_id)?;
    score_color = get_score_color(score_points);
    current_stage = retrieve_score_value(&connection, "set_number", &game_id, &team_id)?;
    is_stage_won = check_for_stage_won(&game_id, max_score, &score_points)?;

    if is_stage_won {
        current_stage = update_team_set(&connection, &team_id, &game_id)?;
        update_game_set(&connection, &game_id)?;
        is_game_won = check_for_game_won(game_id)?;
    }

    if is_game_won {
        record_winner(&connection, &game_id, &team_id)?;
    }

    let game_update = GameUpdate {
        score_color,
        current_stage,
        is_game_won,
        is_stage_won,
    };

    publish_game_update(app_handle, game_update, team_id, score_points)
}

fn publish_game_update(app_handle: tauri::AppHandle, configuration: GameUpdate, team_id: i64, score_points: i64) -> Result<(), Error> {
    let update_payload = UpdatePayload {
        team_id,
        configuration,
        score_points,
    };
    app_handle.emit_all("score_update", update_payload)?;
    Ok(())
}
