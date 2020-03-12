import { join } from 'path'
import { existsSync } from 'fs'
import * as dotenv from 'dotenv'

const getDotEnvFiles = (basePath: string, mode: string) =>
  [`${join(basePath, '.env')}`, mode ? `${join(basePath, `.env.${mode}`)}` : ''].filter(Boolean)

const setupDotEnv = (dotEnvFile: string, debug: boolean) => {
  try {
    const { parsed } = dotenv.config({
      path: dotEnvFile,
      debug: debug ? true : undefined
    })
    // override
    if (parsed) {
      Object.entries(parsed).forEach(([key, val]) => {
        process.env[key] = val
      })
    }
  } catch (err) {
    // only ignore error if file is not found
    if (err.toString().indexOf('ENOENT') < 0) {
      console.error(err)
    }
  }
}

export function loadEnv({ basePath = process.cwd(), mode = '', debug = false }) {
  getDotEnvFiles(basePath, mode).forEach(dotEnvFile => {
    if (existsSync(dotEnvFile)) {
      setupDotEnv(dotEnvFile, debug)
    }
    if (existsSync(`${dotEnvFile}.local`)) {
      setupDotEnv(`${dotEnvFile}.local`, debug)
    }
  })
}
