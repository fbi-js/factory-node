module.exports = {
  port: 3001,
  proxys: [
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
