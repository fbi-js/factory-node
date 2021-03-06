import { Gateway } from '@mrapi/gateway'
export * as types from './types'

import mock from './mockService'
import routes from './routes'
import middlewares from './middlewares'
import initProxy from './helpers/initProxy'
const { port = 3001 } = require('../mrapi.config')

// mock service
mock()

// init gateway
const app = new Gateway({
  app: {},
  clients: true,
  services: []
})
export { app }

// add middlewares
middlewares()
// add custome routes
routes()

// add proxys
initProxy()
app
  .start(port)
  .then((address: any) => {
    app.logger.info(`Server Listen ${address.port}`)
  })
  .catch((err) => app.logger.error(err))
