import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Declaración global para evitar múltiples instancias en desarrollo
declare global {
  var prisma: PrismaClient | undefined
}

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

/**
 * Singleton de PrismaClient
 * En desarrollo, usar global para hot-reload sin crear múltiples conexiones
 * En producción, crear una nueva instancia
 */
const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

/**
 * Conectar a la base de datos
 */
export const connectDB = async () => {
  try {
    await prisma.$connect()
    console.log('✅ Conectado a la base de datos PostgreSQL')
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error)
    process.exit(1)
  }
}

/**
 * Desconectar de la base de datos
 */
export const disconnectDB = async () => {
  await prisma.$disconnect()
  console.log('👋 Desconectado de la base de datos')
}

// Manejar cierre de la aplicación
process.on('beforeExit', async () => {
  await disconnectDB()
})

export default prisma
