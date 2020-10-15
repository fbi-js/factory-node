// options for prisma client
const prismaOptions = {
  log:
    process.env.NODE_ENV === 'production'
      ? ['warn', 'error']
      : ['query', 'info', 'warn', 'error'],
  errorFormat: 'minimal', // 'pretty' | 'colorless' | 'minimal'
}

// middlewares for prisma
const prismaMiddlewares = [
  async (params, next) => {
    const before = Date.now()
    const result = await next(params)
    const after = Date.now()
    console.log(
      `Prisma Middleware: Query ${params.model}.${params.action} took ${after -
        before}ms`,
    )
    return result
  },
]

module.exports = {
  dal: {
    <%_ if (project.features['multi-tenant']) { _%>
    services: [
      {
        name: 'blog',
        db: {
          // use sqlit default
          tenants: {
            a: '',
            b: '',
          },
          defaultTenant: 'a',
          prismaOptions,
          prismaMiddlewares,
        },
        graphql: {
          enable: true,
        },
      },
      {
        name: 'music',
        db: {
          tenants: {
            a: 'mysql://root:123456@0.0.0.0:3306/music-a',
            b: 'mysql://root:123456@0.0.0.0:3306/music-b',
          },
          defaultTenant: 'a',
          prismaOptions,
          prismaMiddlewares,
        },
        openapi: {
          enable: false,
        },
      },
    ],
    // enabled services management
    management: {
      database: 'mysql://root:123456@0.0.0.0:3306/dal-management',
    },
    <%_ } else { _%>
    services: [
      {
        db: {
          tenants: [
            {
              name: 'default',
              // use sqlite if database if empty
              database: '',
              // or: use mysql, pg
              // database: 'mysql://root:123456@0.0.0.0:3306/test',
            },
          ],
          prismaOptions,
          prismaMiddlewares,
        },
      },
    ],
    <%_ } _%>
  },
}
