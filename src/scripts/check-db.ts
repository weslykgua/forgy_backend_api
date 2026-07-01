import prisma from '../config/database'

async function checkDb() {
  try {
    const users = await prisma.user.findMany()
    console.log('--- Users ---')
    console.log(users.map(u => ({ id: u.id, email: u.email, name: u.name })))

    for (const user of users) {
      console.log(`\n--- User ${user.email} ---`)
      const sessions = await prisma.trainingSession.findMany({ where: { userId: user.id } })
      console.log(`Training sessions: ${sessions.length}`)

      const streaks = await prisma.workoutStreak.findMany({ where: { userId: user.id } })
      console.log('Streaks:', streaks)

      const records = await prisma.personalRecord.findMany({ where: { userId: user.id } })
      console.log('Personal Records:', records.length)

      const progress = await prisma.dailyProgress.findMany({ where: { userId: user.id } })
      console.log('Daily Progress records:', progress.length)
      console.log(progress.map(p => ({ date: p.date, weight: p.weight, water: p.waterIntake, sleep: p.sleepHours })))
    }
  } catch (error) {
    console.error('Error querying DB:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDb()
