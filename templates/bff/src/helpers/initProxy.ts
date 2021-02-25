import { app, types } from '../app'

export default function () {
  (app.config as any).service.forEach((proxy: types.mrapi.GatewayServiceConfig) => {
    app.addService(proxy)
  })
}
