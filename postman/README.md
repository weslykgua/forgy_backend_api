# Forgy API Postman Package

This folder contains a Postman collection and environment for the mounted backend routes.

## Files

- `Forgy API.postman_collection.json` - import this collection into Postman.
- `Forgy.local.postman_environment.json` - local environment with `baseUrl` and placeholder variables.

## Import Order

1. Import the environment first.
2. Import the collection.
3. Run `Auth > Login` and copy the returned token into `{{token}}`.
4. Fill in `{{userId}}`, `{{exerciseId}}`, `{{routineId}}`, `{{workoutId}}`, and `{{goalId}}` as needed.

## Mounted Routes Covered

- `/auth/register`
- `/auth/login`
- `/user/profile`
- `/user/streak`
- `/dashboard`
- `/exercises`
- `/exercises/stats`
- `/goals/plan`
- `/goals`
- `/progress`
- `/progress/stats`
- `/workouts`
- `/workouts/calendar`
- `/workouts/history`
- `/workouts/streak/:userId`
- `/workouts/records/:userId`
- `/routines`
- `/routines/:id`
- `/routines/:id/exercises`

## Not Mounted Yet

These route files exist, but they are not mounted in `src/index.ts` right now:

- `src/routes/measurementsRoutes.ts`
- `src/routes/recommendationsServiceIA.ts`

If you want, I can add them to the app and extend the Postman collection too.