import { mrapi } from '@mrapi/service'

const config: mrapi.PartialConfig = {
  <%_ if (project.features.multiple) { _%>
  service: [
    {
      name: 'user',
      // mock: true,
    },
    {
      name: 'post',
      // mock: true,
    },
  ],
  <%_ } else { _%>
  service: {
    <%_ if (project.features.prisma) { _%>
    schema: 'prisma/schema.prisma',
    database: 'file:./dev.db',
    <%_ } _%>
    <%_ if (project.features.multiple) { _%>
    graphql: {
      queryDepth: 3,
    },
    <%_ } _%>
    openapi: <%= Boolean(project.features.openapi) %>
  }
  <%_ } _%>

  // graphql: {
  //   stitching: true,
  // },
  logger: {
    prettyPrint: true,
  },
}

export default config
// const a: mrapi.Get
