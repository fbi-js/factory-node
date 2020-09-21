import { join } from 'path'
import { Command, utils } from 'fbi'
import Factory from '..'

export default class CommandBuild extends Command {
  id = 'build'
  alias = 'b'
  description = 'command build description'
  args = ''
  flags = [
    ['-m, --mode <mode>', 'specify env mode(development|production|testing)', 'production'],
    ['-d, --dev-dependencies', 'with devDependencies', false]
  ]

  constructor(public factory: Factory) {
    super()
  }

  public async run(flags: any, unknown: any) {
    process.env.NODE_ENV = flags.mode ?? 'production'

    this.debug(
      `Factory: (${this.factory.id})`,
      'from command',
      `"${this.id}"`,
      'flags:',
      flags,
      'unknown:',
      unknown
    )

    const _cwd = process.cwd()
    const features = this.context.get('config.factory.features')

    const tsconfigPath = join(_cwd, 'tsconfig.json')
    const hasTsconfigFile = await this.fs.pathExists(tsconfigPath)
    const tsconifg = hasTsconfigFile ? require(tsconfigPath) : null
    const distDirName = tsconifg?.compilerOptions?.outDir || 'dist'
    const distDir = join(_cwd, distDirName)
    // const srcDir = join(_cwd, tsconifg.compilerOptions.rootDir||'src')
    const template = this.context.get('config.factory.template')

    this.logStart(`Start building:`)
    this.logItem(`remove '${distDirName}'...`)
    await this.fs.remove(distDir)

    const execOpts: any = {
      ...this.factory.execOpts,
      stdio: flags.debug ? 'inherit' : 'pipe'
    }

    // this.logItem('generate prisma client files...')
    // await this.exec.command('prisma2 generate', execOpts)

    try {
      this.clear()
      this.logItem('compile ts files...')
      if (!!~template.indexOf('dal')) await this.exec.command('npm run generate', execOpts)
      await this.exec.command('tsc', execOpts)
    } catch (err) {
      this.error('Failed to build')
      this.error(err).exit()
    }
    // if (flags.devDependencies) {
    //   const pkg = require(join(_cwd, 'package.json'))
    //   const ver = this.factory.version ? `#${this.factory.version}` : ''
    //   pkg['devDependencies'] = utils.merge(pkg['devDependencies'], {
    //     [this.factory.id]: `github:fbi-js/${this.factory.id}${ver}`,
    //     fbi: '^4.0.0-alpha.1'
    //   })

    //   this.logItem('generate package.json...')
    //   await this.fs.writeFile(join(distDir, 'package.json'), JSON.stringify(pkg, null, 2))
    //   this.logItem('copy .fbi.config.js...')
    //   await this.fs.copy(join(_cwd, '.fbi.config.js'), join(distDir, '.fbi.config.js'))

    //   if (features?.prisma) {
    //     this.logItem('copy prisma folder...')
    //     await this.fs.copy(join(_cwd, 'prisma'), join(distDir, 'prisma'))
    //   }
    // }
    this.logEnd('Build successfully')
  }
}
