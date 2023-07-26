use serde::ser::{Serialize, Serializer};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Rusqlite error: {0}")]
    RusqliteError(#[from] rusqlite::Error),

    #[error("Custom error: {0}")]
    CustomError(String),

    #[error("Tauri error: {0}")]
    TauriError(#[from] tauri::Error),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: Serializer,
    {
        serializer.serialize_str(&format!("BACKEND ERROR: {}", self))
    }
}

