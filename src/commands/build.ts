import { join } from 'path'
import { Command, utils } from 'fbi'
import Factory from '..'

export default class CommandBuild extends Command {
  id = 'build'
  alias = 'b'
  args = ''
  flags = []
  description = 'command build description'

  constructor(public factory: Factory) {
    super()
  }

  public async run(args: any, flags: any) {
    this.debug(`Factory: (${this.factory.id})`, 'from command', `"${this.id}"`)

    const spinner = this.createSpinner(`Start building...`).start()

    const tsconifgFile = join(process.cwd(), 'tsconfig.json')
    const outDir = utils.isModuleAvailable(tsconifgFile)
      ? require(tsconifgFile).compilerOptions.outDir
      : 'lib'

    await this.fs.remove(join(process.cwd(), outDir))

    const execOpts: any = {
      ...this.factory.execOpts,
      stdio: flags.debug ? 'inherit' : 'pipe'
    }

    await this.exec.command('prisma2 generate', execOpts)
    await this.exec.command('tsc', execOpts)

    spinner.succeed('build successfully')
  }
}
