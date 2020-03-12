<%_ if (project.features.prisma) { _%>
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
<%_ } _%>
import { PubSub } from 'graphql-yoga'
import { ContextParameters } from 'graphql-yoga/dist/types'

const pubsub = new PubSub()
<%_ if (project.features.prisma) { _%>
dotenv.config()
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn'],
})
<%_ } _%>

export interface Context {
  request: any
  pubsub: PubSub
  <%_ if (project.features.prisma) { _%>
  prisma: PrismaClient
  <%_ } _%>
}

export function createContext(request: ContextParameters): Context {
  return {
    ...request,
    pubsub,
    <%_ if (project.features.prisma) { _%>
    prisma,
    <%_ } _%>
  }
}
