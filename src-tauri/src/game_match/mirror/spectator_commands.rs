use tauri::{AppHandle, command};

#[command]
pub async fn open_spectator_window(handle: AppHandle) {
    std::thread::spawn(move || {
        let _ = tauri::WindowBuilder::new(
            &handle,
            "spectator",
            tauri::WindowUrl::App("/audience_window".into()),
        ).build()
            .unwrap_or_else(|error| {
                panic!("{}", error)
            });
    });
}
