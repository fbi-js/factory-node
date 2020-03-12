import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

async function main() {
  const role = await prisma.role.create({
    data: {
      name: 'User'
    }
  })
  const user = await prisma.user.create({
    data: {
      name: 'first-user',
      password: '000000',
      roles: {
        connect: {
          id: role.id
        }
      }
    }
  })

  return {
    role,
    user
  }
}

main()
  .then(data => {
    console.log('created data:', data)
  })
  .finally(async () => {
    await prisma.disconnect()
  })
