import { mrapi } from '@mrapi/service'

const config: mrapi.PartialConfig = {
  <%_ if (project.features.multiModules) { _%>
  service: [
    {
      name: 'blog',
      graphql: <%= Boolean(project.features.graphql) %>,
      openapi: <%= Boolean(project.features.openapi) %>,
      <%_ if (project.features.multiTenants) { _%>
      datasource: {
        provider: 'prisma',
        schema: 'prisma/blog/schema.prisma',
      },
      tenants: [
        {
          name: 'one',
          database: 'file:./blog-one.db',
        },
        {
          name: 'two',
          database: 'file:./blog-two.db',
        },
      ],
      multiTenant: {
        mode: 'seprate-db',
        default: 'one',
      },
      <%_ } else { _%>
      database: 'file:./blog.db',
      schema: 'prisma/blog/schema.prisma',
      <%_ } _%>
    },
    <%_ if (project.features.multiTenants) { _%>
    {
      name: 'management',
      schema: 'prisma/management/schema.prisma',
      database: 'file:./dev.db',
      management: true,
      graphql: {
        introspection: process.env.NODE_ENV !== 'production',
      },
    },
    <%_ } _%>
  ],
  <%_ } else { _%>
  service: {
    graphql: <%= Boolean(project.features.graphql) %>,
    openapi: <%= Boolean(project.features.openapi) %>,
    <%_ if (project.features.multiTenants) { _%>
    datasource: {
      provider: 'prisma',
      schema: 'prisma/schema.prisma',
    },
    tenants: [
      {
        name: 'one',
        database: 'file:./blog-one.db',
      },
      {
        name: 'two',
        database: 'file:./blog-two.db',
      },
    ],
    multiTenant: {
      mode: 'seprate-db',
      default: 'one',
    },
    <%_ } else { _%>
    database: 'file:./blog.db',
    schema: 'prisma/schema.prisma',
    <%_ } _%>
  },
  <%_ } _%>
  logger: {
    prettyPrint: true,
  },
}

export default config
