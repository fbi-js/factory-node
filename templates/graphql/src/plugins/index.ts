import { plugin } from 'nexus'

export const LogMutationTimePlugin = plugin({
  name: 'LogMutationTimePlugin',
  onCreateFieldResolver(config) {
    if (config.parentTypeConfig.name !== 'Mutation') {
      return
    }
    return async (root, args, ctx, info, next) => {
      const startTimeMs = new Date().valueOf()
      const value = await next(root, args, ctx, info)
      const endTimeMs = new Date().valueOf()
      console.log(
        `=> Mutation \`${info.operation.name ||
          info.fieldName}\` took ${endTimeMs - startTimeMs} ms`,
      )
      console.log(`   Args: ${JSON.stringify(args)}`)
      console.log(`   Response: ${JSON.stringify(value)}`)
      return value
    }
  },
})
