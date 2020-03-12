<%_ if (project.features.nexus) { _%>
/// <reference path="./generated/nexus.ts" />
import { makeSchema } from 'nexus'
import { nexusPrismaPlugin } from 'nexus-prisma'
<%_ } _%>
import * as baseTypes from './graphql-custom'
import * as appTypes from './graphql'
import { LogMutationTimePlugin } from './plugins/'

export const schema = makeSchema({
  types: {
    ...appTypes,
    baseTypes,
  },
  plugins: [
    <%_ if (project.features.nexus) { _%>
    nexusPrismaPlugin(),
    <%_ } _%>
    LogMutationTimePlugin
  ],
  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    <%_ if (project.features.nexus) { _%>
    typegen: __dirname + '/generated/nexus.ts',
    <%_ } _%>
  },
  typegenAutoConfig: {
    sources: [
      <%_ if (project.features.prisma) { _%>
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
      <%_ } _%>
      {
        source: require.resolve('./context'),
        alias: 'Context',
      },
    ],
    contextType: 'Context.Context',
  },
})
