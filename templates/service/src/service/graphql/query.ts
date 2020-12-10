import { extendType, objectType<%_ if (!project.features.prisma) { _%>, arg, list<%_ } _%> } from '@nexus/schema'
import { Context } from '../context'

<%_ if (!project.features.prisma) { _%>
const Post = objectType({
  name: 'Post',
  definition(t) {
    t.nonNull.int('id', { description: 'id' })
    t.nonNull.string('title', { description: 'post title' })
  },
})
<%_ } _%>

export const customQuery = extendType({
  type: 'Query',
  definition(t) {
    <%_ if (project.features.prisma) { _%>
    t.nullable.field('me', {
      type: 'User',
      description: 'Get current user info',
      async resolve(_root, _args, ctx: Context, _info) {
        console.log('me', ctx.req.headers, ctx.userId)
        return ctx.prisma.user.findUnique({
          where: {
            id: ctx.userId,
          },
        })
      },
    })

    t.list.field('drafts', {
      type: 'Post',
      description: 'Get unpublished posts',
      args: {
        where: arg({ type: 'PostWhereInput' }),
        orderBy: arg({ type: list('PostOrderByInput') }),
        cursor: 'PostWhereUniqueInput',
        skip: 'Int',
        take: 'Int',
      },
      resolve(_root, args, ctx: Context) {
        return ctx.prisma.post.findMany({
          ...args,
          where: {
            ...args.where,
            published: {
              equals: false,
            },
          },
        })
      },
    })
    <%_ } else { _%>
    t.field('post', {
      type: Post,
      async resolve(_, _args, ctx: Context) {
        return {
          id: 1,
          title: '1st post',
        }
      },
    })
    <%_ } _%>
  },
})
