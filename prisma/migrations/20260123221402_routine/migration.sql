-- CreateTable
CREATE TABLE "Routine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Routine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "body_measurements" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "chest" DOUBLE PRECISION,
    "waist" DOUBLE PRECISION,
    "hips" DOUBLE PRECISION,
    "bicepLeft" DOUBLE PRECISION,
    "bicepRight" DOUBLE PRECISION,
    "thighLeft" DOUBLE PRECISION,
    "thighRight" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "body_measurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoutineExercises" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RoutineExercises_AB_unique" ON "_RoutineExercises"("A", "B");

-- CreateIndex
CREATE INDEX "_RoutineExercises_B_index" ON "_RoutineExercises"("B");

-- AddForeignKey
ALTER TABLE "_RoutineExercises" ADD CONSTRAINT "_RoutineExercises_A_fkey" FOREIGN KEY ("A") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoutineExercises" ADD CONSTRAINT "_RoutineExercises_B_fkey" FOREIGN KEY ("B") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
