import type { mrapi } from '@mrapi/service'

export const serverTimeRoutes = [
  {
    method: 'GET',
    url: '/demo',
    async handler(_req: mrapi.Request, res: mrapi.Response) {
      res.send('demo')
    },
  },
]
