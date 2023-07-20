
#[tauri::command]
pub async fn open_spectator_window(handle: tauri::AppHandle) -> Result<(), tauri::Error> {
    let docs_window = tauri::WindowBuilder::new(
        &handle,
        "spectator",
        tauri::WindowUrl::App("/match".into())
    ).build()?;

    Ok(())
}