import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

async function main() {

}

main().finally(async () => {
  await prisma.disconnect()
})
