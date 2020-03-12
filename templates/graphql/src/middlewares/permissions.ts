import { rule, shield, and, or } from 'graphql-shield'
import { getUserId } from '../utils'
import { Role } from '@prisma/client'

const rules = {
  isAuthenticated: rule()((parent, args, ctx) => {
    const userId = getUserId(ctx)
    return Boolean(userId)
  }),
  isAdmin: rule()(async (parent, args, ctx) => {
    const userId = getUserId(ctx)
    if (!Boolean(userId)) {
      return false
    }
    const roles = await ctx.prisma.user
      .findOne({
        where: {
          id: userId
        }
      })
      .roles()

    return roles ? roles.some((r: Role) => r.name === 'admin') : false
  })
}

export const permissionsMiddleware = shield(
  {
    Query: {
      // me: rules.isAuthenticated,
      // user: and(rules.isAuthenticated, rules.isAdmin),
    },
    Mutation: {}
  },
  {
    debug: true
  }
)
