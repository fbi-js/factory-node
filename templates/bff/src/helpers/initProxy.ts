import { app, types } from '../app'
import axios from 'axios'
const { proxys } = require('../../config')

export default function () {
  const clients: types.Clients = {}
  proxys.forEach((proxy: types.mrapi.GatewayServiceConfig) => {
    app.addService(proxy)
    clients[proxy.name] = axios.create({
      baseURL: proxy.url,
      timeout: 30000
    })
  })
  // add clients to application
  Object.defineProperty(app, 'clients', { value: clients })
}
