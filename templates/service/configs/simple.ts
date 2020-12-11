import { mrapi } from '@mrapi/service'

const config: mrapi.PartialConfig = {
  <%_ if (project.features.multiModules) { _%>
  service: [
    {
      name: 'blog',
      graphql: <%= Boolean(project.features.graphql) %>,
      openapi: <%= Boolean(project.features.openapi) %>
    },
  ],
  <%_ } else { _%>
  service: {
    graphql: <%= Boolean(project.features.graphql) %>,
    openapi: <%= Boolean(project.features.openapi) %>
  },
  <%_ } _%>
  logger: {
    prettyPrint: true,
  },
}

export default config
