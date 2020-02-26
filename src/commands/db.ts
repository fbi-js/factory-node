import { Command } from 'fbi'
import Factory from '..'

export default class CommandDb extends Command {
  id = 'db'
  alias = 'd'
  args = ''
  flags = [
    ['-u, --up', 'Apply any migrations that have not been applied yet'],
    ['-d, --down', 'Undo migrations']
  ]
  description = 'database migrations'

  constructor(public factory: Factory) {
    super()
  }

  public async run(args: any, flags: any) {
    this.debug(`Factory: (${this.factory.id})`, 'from command', `"${this.id}"`, { args, flags })

    let action = 'up'
    if (!flags.up && !flags.down) {
      const ret = await this.prompt({
        type: 'select',
        name: 'action',
        message: 'Choose an action:',
        hint: 'Use arrow-keys, <return> to submit',
        choices: ['up', 'down']
      })

      action = ret.action
    }

    this.logStart(`Start database migrate ${action}...`)

    const execOpts: any = {
      ...this.factory.execOpts,
      stdio: 'inherit'
    }

    switch (action) {
      case 'up':
        await this.exec.command('prisma2 migrate save --name "" --experimental', execOpts)
        await this.exec.command('prisma2 migrate up --experimental', execOpts)
        break
      case 'down':
        await this.exec.command('prisma2 migrate down --experimental', execOpts)
        break
    }

    this.logEnd('database migrate successfully')
  }
}
