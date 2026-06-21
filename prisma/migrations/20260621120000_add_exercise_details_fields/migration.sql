-- AlterTable
ALTER TABLE "exercises" ADD COLUMN "bodyPart" TEXT,
ADD COLUMN "muscleGroup" TEXT,
ADD COLUMN "secondaryMuscles" TEXT[],
ADD COLUMN "target" TEXT;
