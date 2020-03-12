/**
 * `fbi s`                 : process.env.NODE_ENV=development
 * `fbi b`                 : process.env.NODE_ENV=production
 * `fbi b -m production`   : process.env.NODE_ENV=production
 * `fbi b -m development`  : process.env.NODE_ENV=development
 * `fbi b -m testing`      : process.env.NODE_ENV=testing
 */
import { loadEnv } from './load-env'

loadEnv({
  basePath: __dirname,
  mode: process.env.NODE_ENV
})
