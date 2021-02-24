import { app } from '../app'
import { CRoute } from '../types'

export default <Array<CRoute>> [{
  url: '/server-time',
  method: 'GET',
  handler(_req, res) {
    // request use service name
    app.clients?.service.get('/')
    res.end(new Date().toString())
  }
}]