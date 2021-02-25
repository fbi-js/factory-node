import { app } from '../app'
import { CRoute } from '../types'

export default <Array<CRoute>> [{
  url: '/server-time',
  method: 'GET',
  async handler (_req, res) {
    // request use service name
    const resp = await app.clients.service.get('/')
    res.end(new Date().toString() + resp.data)
  }
}]
