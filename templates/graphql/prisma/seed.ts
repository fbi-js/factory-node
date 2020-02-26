import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

async function main() {
  const roleAdmin = await prisma.role.create({
    data: {
      name: '管理员',
      nameEn: 'admin'
    }
  })

  const roleEmployee = await prisma.role.create({
    data: {
      name: '员工',
      nameEn: 'employee'
    }
  })

  console.log({ roleAdmin, roleEmployee })

  const user1 = await prisma.user.create({
    data: {
      name: 'shaw',
      password: '$2a$10$0u9wOOLSvToUfV0RRHfsdec2pQA.olxjQT9bJHg4ReyY9WYqkoIZ.', // "666666"
      roles: { connect: { id: roleAdmin.id } }
    }
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'echo',
      password: '$2a$10$0u9wOOLSvToUfV0RRHfsdec2pQA.olxjQT9bJHg4ReyY9WYqkoIZ.', // "666666"
      roles: { connect: { id: roleAdmin.id } }
    }
  })

  const user3 = await prisma.user.create({
    data: {
      name: 'test',
      password: '$2a$10$0u9wOOLSvToUfV0RRHfsdec2pQA.olxjQT9bJHg4ReyY9WYqkoIZ.', // "666666"
      roles: { connect: { id: roleEmployee.id } }
    }
  })

  console.log({ user1, user2, user3 })

  const category1 = await prisma.categories.create({
    data: {
      name: '咖啡',
      nameEn: 'Coffee',
      status: 'NORMAL'
    }
  })

  const category2 = await prisma.categories.create({
    data: {
      name: '茶',
      nameEn: 'Tea',
      status: 'NORMAL'
    }
  })

  const category3 = await prisma.categories.create({
    data: {
      name: '饮料',
      nameEn: 'Drink',
      status: 'NORMAL'
    }
  })

  console.log({ category1, category2, category3 })
}

main().finally(async () => {
  await prisma.disconnect()
})
