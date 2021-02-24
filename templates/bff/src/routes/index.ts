import { app } from '../app'
import { CRoute } from '../types'

import serverTime from './serverTime'

export default function () {
  ([] as Array<CRoute>)
    .concat(serverTime)
    .forEach(route => {
      app.on(route.method, route.url, route.handler)
    })
}
