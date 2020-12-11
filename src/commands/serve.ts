import { Command } from 'fbi'
import Factory from '..'

export default class CommandServe extends Command {
  id = 'serve'
  alias = 's'
  description = 'start development server'
  args = '<file>'
  flags = [['-m, --mode <mode>', 'specify env mode(development|production|testing)', 'development']]

  constructor(public factory: Factory) {
    super()
  }

  public async run(file: string, flags: any, unknown: any) {
    process.env.NODE_ENV = flags.mode ?? 'development'
    this.debug(
      `Factory: (${this.factory.id})`,
      'from command',
      `"${this.id}"`,
      'flags:',
      flags,
      'unknown:',
      unknown
    )

    this.logStart(`Starting development server:`)
    const execOpts: any = {
      ...this.factory.execOpts,
      stdio: 'inherit'
    }
    try {
      this.clear()
      await this.exec.command(
        `ts-node-dev --respawn --prefer-ts --transpile-only${
          flags.debug ? ' --debug' : ''
        } ${file}`,
        execOpts
      )
    } catch (err) {
      this.error('Failed to starting server')
      this.error(err).exit()
    }
  }
}
