import { Command } from 'fbi'
import Factory from '..'

export default class CommandServe extends Command {
  id = 'serve'
  alias = 's'
  args = ''
  flags = []
  description = 'command serve description'

  constructor(public factory: Factory) {
    super()
  }

  public async run(args: any, flags: any) {
    this.debug(`Factory: (${this.factory.id})`, 'from command', `"${this.id}"`)

    this.logStart(`Starting development server:`)
    const execOpts: any = {
      ...this.factory.execOpts,
      stdio: 'inherit'
    }

    try {
      this.clear()
      await this.exec.command(
        `ts-node-dev --clear --respawn --prefer-ts --transpile-only${
          flags.debug ? ' --debug' : ''
        } src/index.ts`,
        execOpts
      )
    } catch (err) {
      this.error('Failed to starting server')
      this.error(err).exit()
    }
  }
}
