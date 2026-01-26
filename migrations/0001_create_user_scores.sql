-- Migration: Create user_scores table to store last submitted scores for signed-in users
CREATE TABLE IF NOT EXISTS user_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clerk_user_id TEXT NOT NULL UNIQUE,
    scores TEXT NOT NULL, -- JSON object containing score fields
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Create index for faster lookups by clerk_user_id
CREATE INDEX IF NOT EXISTS idx_user_scores_clerk_user_id ON user_scores(clerk_user_id);
