/*
  Warnings:

  - You are about to drop the column `date` on the `workout_logs` table. All the data in the column will be lost.
  - You are about to drop the column `exerciseName` on the `workout_logs` table. All the data in the column will be lost.
  - You are about to drop the `Routine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoutineExercises` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nutrition_plans` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `date` on the `body_measurements` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `date` on the `daily_progress` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `userId` to the `goals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trainingSessionId` to the `workout_logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_RoutineExercises" DROP CONSTRAINT "_RoutineExercises_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoutineExercises" DROP CONSTRAINT "_RoutineExercises_B_fkey";

-- DropIndex
DROP INDEX "workout_logs_date_idx";

-- AlterTable
ALTER TABLE "body_measurements" ADD COLUMN     "bodyFat" DOUBLE PRECISION,
ADD COLUMN     "calves" DOUBLE PRECISION,
ADD COLUMN     "neck" DOUBLE PRECISION,
ADD COLUMN     "shoulders" DOUBLE PRECISION,
ADD COLUMN     "userId" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION,
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "daily_progress" ADD COLUMN     "energy" INTEGER,
ADD COLUMN     "stress" INTEGER,
ADD COLUMN     "userId" TEXT,
ADD COLUMN     "workoutsCompleted" INTEGER,
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "exercises" ADD COLUMN     "category" TEXT;

-- AlterTable
ALTER TABLE "goals" ADD COLUMN     "priority" TEXT,
ADD COLUMN     "unit" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "activityLevel" TEXT,
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "fitnessGoal" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "weight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "workout_logs" DROP COLUMN "date",
DROP COLUMN "exerciseName",
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "trainingSessionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Routine";

-- DropTable
DROP TABLE "_RoutineExercises";

-- DropTable
DROP TABLE "nutrition_plans";

-- CreateTable
CREATE TABLE "routines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "difficulty" TEXT,
    "estimatedDuration" INTEGER,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routine_exercises" (
    "id" TEXT NOT NULL,
    "routineId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "targetSets" INTEGER,
    "targetReps" INTEGER,
    "targetWeight" DOUBLE PRECISION,
    "restTime" INTEGER,
    "notes" TEXT,

    CONSTRAINT "routine_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_sessions" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,
    "totalVolume" DOUBLE PRECISION,
    "caloriesBurned" INTEGER,
    "notes" TEXT,
    "rating" INTEGER,
    "userId" TEXT NOT NULL,
    "routineId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "reps" INTEGER,
    "weight" DOUBLE PRECISION,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personal_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_streaks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastWorkoutDate" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workout_streaks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_recommendations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "basedOn" JSONB,
    "confidence" DOUBLE PRECISION,
    "expiresAt" TIMESTAMP(3),
    "dismissedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "routines_userId_idx" ON "routines"("userId");

-- CreateIndex
CREATE INDEX "routines_type_idx" ON "routines"("type");

-- CreateIndex
CREATE INDEX "routine_exercises_routineId_idx" ON "routine_exercises"("routineId");

-- CreateIndex
CREATE UNIQUE INDEX "routine_exercises_routineId_order_key" ON "routine_exercises"("routineId", "order");

-- CreateIndex
CREATE INDEX "training_sessions_date_idx" ON "training_sessions"("date");

-- CreateIndex
CREATE INDEX "training_sessions_userId_idx" ON "training_sessions"("userId");

-- CreateIndex
CREATE INDEX "training_sessions_userId_date_idx" ON "training_sessions"("userId", "date");

-- CreateIndex
CREATE INDEX "personal_records_userId_idx" ON "personal_records"("userId");

-- CreateIndex
CREATE INDEX "personal_records_exerciseId_idx" ON "personal_records"("exerciseId");

-- CreateIndex
CREATE INDEX "personal_records_userId_exerciseId_idx" ON "personal_records"("userId", "exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "workout_streaks_userId_key" ON "workout_streaks"("userId");

-- CreateIndex
CREATE INDEX "ai_recommendations_userId_idx" ON "ai_recommendations"("userId");

-- CreateIndex
CREATE INDEX "ai_recommendations_status_idx" ON "ai_recommendations"("status");

-- CreateIndex
CREATE INDEX "ai_recommendations_userId_status_idx" ON "ai_recommendations"("userId", "status");

-- CreateIndex
CREATE INDEX "body_measurements_date_idx" ON "body_measurements"("date");

-- CreateIndex
CREATE INDEX "body_measurements_userId_idx" ON "body_measurements"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "daily_progress_date_key" ON "daily_progress"("date");

-- CreateIndex
CREATE INDEX "daily_progress_date_idx" ON "daily_progress"("date");

-- CreateIndex
CREATE INDEX "daily_progress_userId_idx" ON "daily_progress"("userId");

-- CreateIndex
CREATE INDEX "exercises_difficulty_idx" ON "exercises"("difficulty");

-- CreateIndex
CREATE INDEX "goals_userId_idx" ON "goals"("userId");

-- CreateIndex
CREATE INDEX "goals_achieved_idx" ON "goals"("achieved");

-- CreateIndex
CREATE INDEX "workout_logs_trainingSessionId_idx" ON "workout_logs"("trainingSessionId");

-- AddForeignKey
ALTER TABLE "routines" ADD CONSTRAINT "routines_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine_exercises" ADD CONSTRAINT "routine_exercises_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "routines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine_exercises" ADD CONSTRAINT "routine_exercises_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "routines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_logs" ADD CONSTRAINT "workout_logs_trainingSessionId_fkey" FOREIGN KEY ("trainingSessionId") REFERENCES "training_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_records" ADD CONSTRAINT "personal_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_records" ADD CONSTRAINT "personal_records_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_streaks" ADD CONSTRAINT "workout_streaks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
