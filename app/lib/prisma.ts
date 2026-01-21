import 'dotenv/config'
// Change this line to point to your generated client
import { PrismaClient } from '../../generated/prisma/client' 
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export default prisma