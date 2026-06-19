-- AlterTable
ALTER TABLE "users" ADD COLUMN "planData" JSONB;

-- DropIndex
DROP INDEX IF EXISTS "daily_progress_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "daily_progress_userId_date_key" ON "daily_progress"("userId", "date");
