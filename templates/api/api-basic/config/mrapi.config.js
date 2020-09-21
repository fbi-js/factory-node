const { merge } = require('@mrapi/common')
const util = require('util')

// 加载对应环境配置文件
const env = process.env.CUSTOM_ENV
let envConfig = {}
try {
  if (env) {
    console.log(`[Config] loading ${env} config`)
    let customConfig = require(`./config.${env}`)
    if (customConfig && customConfig.default) customConfig = customConfig.default
    envConfig = customConfig || {}
  }
} catch (err) {
  console.error(err)
}

let config = {
  api: {
    server: {
      port: 1358, // default
      type: 'standalone', // default
      options: {},
    },
    openapi: {
      dir: '/src/openapi', // default
      dalBaseUrl: 'http://localhost',
      prefix: '/api', // default
    },
    graphql: {
      dir: '/src/graphql', // default
      sources: [
        {
          name: 'auth',
          endpoint: 'http://106.52.61.221:30141/graphql', // should be replaced
          prefix: 'auth_',
          snapshot: false,
        },
      ],
    },
  },
}

// exports.default = merge(config, envConfig)

config = merge(config, envConfig)
console.log(`
~~~~~~~~~~Config Start~~~~~~~~~~~~~~~
${util.inspect(config, { compact: true })}
~~~~~~~~~~~~~~~~~~~~~~~~~
`)

exports.default = config
