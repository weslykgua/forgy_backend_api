import { defineConfig } from 'prisma/define-config'

export default defineConfig({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
})