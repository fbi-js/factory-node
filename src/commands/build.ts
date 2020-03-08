import { join } from 'path'
import { Command, utils } from 'fbi'
import Factory from '..'

export default class CommandBuild extends Command {
  id = 'build'
  alias = 'b'
  args = ''
  description = 'command build description'
  flags = [['-d, --dev-dependencies', 'with devDependencies', false]]

  constructor(public factory: Factory) {
    super()
  }

  public async run(args: any, flags: any) {
    this.debug(`Factory: (${this.factory.id})`, 'from command', `"${this.id}"`)

    const spinner = this.createSpinner(`Start building...`).start()

    const tsconfigPath = join(process.cwd(), 'tsconfig.json')
    const hasTsconfigFile = await this.fs.pathExists(tsconfigPath)
    const tsconifg = hasTsconfigFile ? require(tsconfigPath) : null
    const distDir = join(process.cwd(), tsconifg?.compilerOptions?.outDir || 'dist')
    // const srcDir = join(process.cwd(), tsconifg.compilerOptions.rootDir||'src')

    await this.fs.remove(distDir)

    const execOpts: any = {
      ...this.factory.execOpts,
      stdio: flags.debug ? 'inherit' : 'pipe'
    }

    await this.exec.command('prisma2 generate', execOpts)
    await this.exec.command('tsc', execOpts)

    if (flags.devDependencies) {
      const pkg = require(join(process.cwd(), 'package.json'))
      const ver = this.factory.version ? `#${this.factory.version}` : ''
      pkg['devDependencies'] = utils.merge(pkg['devDependencies'], {
        [this.factory.id]: `github:fbi-js/${this.factory.id}${ver}`,
        fbi: '^4.0.0-alpha.1'
      })

      await this.fs.writeFile(join(distDir, 'package.json'), JSON.stringify(pkg, null, 2))
      await this.fs.copy(join(process.cwd(), '.fbi.config.js'), join(distDir, '.fbi.config.js'))
    }

    spinner.succeed('build successfully')
  }
}
