import { GraphQLServer } from 'graphql-yoga'

import './configs'
import { schema } from './schema'
import { createContext } from './context'
import { loggerMiddleware } from './middlewares/logger'
<%_ if (project.features.permissions) { _%>
import { permissionsMiddleware } from './middlewares/permissions'
<%_ } _%>

new GraphQLServer({
  schema,
  context: createContext,
  middlewares: [loggerMiddleware<%_ if (project.features.permissions) { _%>, permissionsMiddleware<%_ } _%> ]
}).start(
  {
    debug: process.env.SERVER_DEBUG === 'true',
    port: process.env.SERVER_PORT,
    endpoint: process.env.SERVER_ENDPOINT,
    playground: process.env.SERVER_PLAYGROUND
  },
  () => {
    const prefix = `http://localhost:${process.env.SERVER_PORT}`
    console.log(`GraphQL Server: ${prefix}${process.env.SERVER_ENDPOINT}`)
    console.log(`Playground: ${prefix}${process.env.SERVER_PLAYGROUND}`)
  }
)
