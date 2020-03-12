import { logger } from '../utils/logger'

export const loggerMiddleware = async (
  resolve: any,
  root: any,
  args: any,
  context: any,
  info: any
) => {
  if (root) {
    return resolve(root, args, context, info)
  }

  const timeStart = Date.now()
  logger.debug(
    `Request[${timeStart}]=> ${info.operation.operation} ${info.fieldName}, Args=> ${JSON.stringify(
      args
    )}`
  )
  const result = await resolve(root, args, context, info)

  logger.debug(`Response[${timeStart}](${Date.now() - timeStart}ms)=> ${JSON.stringify(result)}`)
  return result
}
