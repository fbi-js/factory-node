import { GraphQLServer } from 'graphql-yoga'
<%_ if (project.features.permissions) { _%>
import { permissions } from './permissions'
<%_ } _%>
import { schema } from './schema'
import { createContext } from './context'

new GraphQLServer({
  schema,
  context: createContext,
  middlewares: [ <%_ if (project.features.permissions) { _%>permissions<%_ } _%> ]
}).start(
  {
    debug: true
  },
  () =>
    console.log(
      `🚀 Server ready at: http://localhost:4000\n⭐️ See sample queries: http://pris.ly/e/ts/graphql-auth#5-using-the-graphql-api`
    )
)
