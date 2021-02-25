module.exports = {
  port: 3001,
  gateway: {
    service: [
      {
        name: 'service',
        url: 'http://0.0.0.0:3002'
      },
      {
        name: 'service2',
        url: 'http://0.0.0.0:3003'
      }
    ]
  }
}
