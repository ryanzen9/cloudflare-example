-- Migration number: 0001 	 2026-05-27T08:35:24.324Z

CREATE TABLE IF NOT EXISTS tasks (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    completed INTEGER NOT NULL DEFAULT 0,
    due_date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
