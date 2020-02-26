import { Command } from 'fbi'
import Factory from '..'

export default class CommandGenerate extends Command {
  id = 'generate'
  alias = 'g'
  args = ''
  flags = []
  description = 'command generate description'

  constructor(public factory: Factory) {
    super()
  }

  public async run(args: any, flags: any) {
    this.debug(`Factory: (${this.factory.id})`, 'from command', `"${this.id}"`)

    this.logStart(`Start generating:`)
    const execOpts: any = {
      ...this.factory.execOpts,
      stdio: flags.debug ? 'inherit' : 'pipe'
    }

    this.logItem('prisma client files...')
    await this.exec.command('prisma2 generate', execOpts)

    this.logItem('typescript nexus...')
    await this.exec.command('cnt --mq -f -o', execOpts)

    this.logItem('typescript types...')
    await this.exec.command('create-types', execOpts)

    this.logItem('nexus files...')
    await this.exec.command('ts-node --transpile-only src/schema', execOpts)

    this.logEnd('Generated successfully')
  }
}
