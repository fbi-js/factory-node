import { join } from 'path'
import { Command, utils } from 'fbi'
import * as dotenv from 'dotenv'

const getDotEnvFiles = (basePath: string, mode: string) =>
  [`${join(basePath, '.env')}`, mode ? `${join(basePath, `.env.${mode}`)}` : ''].filter(Boolean)

const setupDotEnv = (dotEnvFile: string, debug: boolean, { error }: any) => {
  try {
    const { parsed } = dotenv.config({
      path: dotEnvFile,
      debug: debug ? true : undefined
    })
    // override
    if (parsed && utils.isValidObject(parsed)) {
      Object.entries(parsed).forEach(([key, val]) => {
        process.env[key] = val
      })
    }
  } catch (err) {
    // only ignore error if file is not found
    if (err.toString().indexOf('ENOENT') < 0) {
      error(err)
    }
  }
}

export function loadEnv(
  { basePath = process.cwd(), mode = '', debug = false },
  { fs, error }: any
) {
  getDotEnvFiles(basePath, mode).forEach(dotEnvFile => {
    if (fs.existsSync(dotEnvFile)) {
      setupDotEnv(dotEnvFile, debug, { error })
    }
    if (fs.existsSync(`${dotEnvFile}.local`)) {
      setupDotEnv(`${dotEnvFile}.local`, debug, { error })
    }
  })
}
