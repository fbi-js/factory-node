import { rule, shield, and, or } from 'graphql-shield'
import { getUserId } from '../utils/'
<%_ if (project.features.prisma) { _%>
import { Role } from '@prisma/client'
<%_ } _%>

const rules = {
  isAuthenticated: rule()((parent, args, ctx) => {
    const userId = getUserId(ctx)
    return Boolean(userId)
  }),
  <%_ if (project.features.prisma) { _%>
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
  }),
  <%_ } _%>
}

export const permissions = shield(
  {
    Query: {
      // me: rules.isAuthenticated,
      <%_ if (project.features.prisma) { _%>
      // user: and(rules.isAuthenticated, rules.isAdmin),
      <%_ } _%>
    },
    Mutation: {}
  },
  {
    debug: true
  }
)
