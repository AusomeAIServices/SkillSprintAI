import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const globalForDb = globalThis as typeof globalThis & { skillSprintDb?: DatabaseSync };

export function database() {
  if (!globalForDb.skillSprintDb) {
    const configuredPath = process.env.SKILLSPRINT_DB_PATH ?? ".data/skillsprint.sqlite";
    const filename = resolve(/* turbopackIgnore: true */ configuredPath);
    mkdirSync(dirname(filename), { recursive: true });
    const db = new DatabaseSync(filename);
    db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS attempts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        lesson_id TEXT NOT NULL,
        lesson_version TEXT NOT NULL,
        lesson_hash TEXT NOT NULL,
        state TEXT NOT NULL CHECK (state IN ('in_progress', 'completed')),
        current_step TEXT NOT NULL,
        visited_steps_json TEXT NOT NULL,
        draft_json TEXT NOT NULL,
        assessment_json TEXT,
        proficiency INTEGER NOT NULL DEFAULT 0,
        artifact_id TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        completed_at TEXT,
        row_version INTEGER NOT NULL DEFAULT 1
      );
      CREATE INDEX IF NOT EXISTS attempts_owner_lesson_state
        ON attempts(user_id, lesson_id, state, updated_at);
      CREATE TABLE IF NOT EXISTS artifacts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        attempt_id TEXT NOT NULL UNIQUE REFERENCES attempts(id),
        lesson_id TEXT NOT NULL,
        lesson_version TEXT NOT NULL,
        assessor_type TEXT NOT NULL CHECK (assessor_type = 'self'),
        visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility = 'private'),
        content_json TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        attempt_id TEXT NOT NULL REFERENCES attempts(id),
        skill_id TEXT NOT NULL,
        due_at TEXT NOT NULL,
        interval_stage INTEGER NOT NULL,
        completed_at TEXT
      );
    `);
    globalForDb.skillSprintDb = db;
  }
  return globalForDb.skillSprintDb;
}
