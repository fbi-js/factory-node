import { mrapi } from '@mrapi/service'

const config: mrapi.PartialConfig = {
  service: {
    graphql: <%= Boolean(project.features.graphql) %>,
    openapi: <%= Boolean(project.features.openapi) %>,
    sources: [
      {
        name: 'auth',
        type: 'graphql',
        endpoint: 'https://covid-19.dava.engineer/api/graphql',
        prefixTransforms: {
          prefix: 'auth_',
          renameType: true,
          renameField: true,
          ignoreList: ['Query.cases'],
        },
        compositions: [
          {
            resolver: 'Query.appConfigs',
            composer: (next) => async (root, args, context, info) => {
              const result = await next(root, args, context, info)
              console.log('composition resolver appConfigs')
              return result ? result.data || result : result
            },
          },
        ],
        ignoreFields: ['Query.case'],
      },
    ],
  },
  logger: {
    prettyPrint: true,
  },
}

export default config
