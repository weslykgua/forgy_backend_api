-- Drop the old unique constraint on date to allow per-user entries
DROP INDEX IF EXISTS "daily_progress_date_key";

-- Create composite unique constraint per user/date
CREATE UNIQUE INDEX IF NOT EXISTS "daily_progress_userId_date_key" ON "daily_progress"("userId", "date");
