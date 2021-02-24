import { App } from '@mrapi/app'

export default async function () {
  const service = new App()
  return new Promise((resolve) => {
    service
      .get('/', (_req, res) => {
        console.log(_req.headers)
        res.end('Hello World!')
      })
      .post('/user', (_req, res) => {
        res.end('Hello User!')
      })
      .listen(3002, (err: any) => {
        if (err) {
          throw err
        }

        return resolve(console.log(
          `Mock service listening at http://localhost:${
            (service.server?.address() as any)?.port
          }`,
        ))
      })
  })
}
