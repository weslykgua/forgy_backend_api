# EXERCISES
GET    /api/exercises?muscle=chest&difficulty=intermediate
GET    /api/exercises/stats

# ROUTINES
GET    /api/routines?userId=xxx
POST   /api/routines
PUT    /api/routines/:id
DELETE /api/routines/:id
POST   /api/routines/:id/exercises
DELETE /api/routines/:id/exercises/:exerciseId

# WORKOUTS
POST   /api/workouts
GET    /api/workouts/history?userId=xxx&limit=10
GET    /api/workouts/streak/:userId
GET    /api/workouts/records/:userId?exerciseId=xxx

# PROGRESS
POST   /api/progress
GET    /api/progress?userId=xxx&days=30

# MEASUREMENTS
GET    /api/measurements?userId=xxx
POST   /api/measurements

# DASHBOARD
GET    /api/dashboard/:userId

# GOALS
GET    /api/goals?userId=xxx&achieved=false
POST   /api/goals
PUT    /api/goals/:id
DELETE /api/goals/:id

# AI RECOMMENDATIONS
POST   /api/ai/recommendations/:userId
GET    /api/ai/recommendations/:userId?status=pending
PATCH  /api/ai/recommendations/:id