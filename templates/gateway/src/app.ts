import { Gateway } from '@mrapi/gateway'

const gateway = new Gateway({
  app: {},
  services: [
    {
      name: 'service',
      url: 'http://0.0.0.0:3000',
    },
  ],
})

gateway.start().catch((err) => gateway.logger.error(err))
