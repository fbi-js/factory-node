import Factory from '..'
import * as ejs from 'ejs'
import { join } from 'path'
import { Template, utils } from 'fbi'
import glob = require('tiny-glob')

const { formatName, isValidObject } = utils
const { version } = require('../../package.json')

export default class TemplateNodeBase extends Template {
  id = 'node-base'
  renderer = ejs.render
  features: any[] = []
  path = ''
  rule = {
    glob: '**/*',
    ignores: [] // examples: '**/app.ts'
  }

  get globPath() {
    return `${this.path}/${this.rule.glob}`
  }

  constructor(public factory: Factory) {
    super(factory)
  }

  protected async gathering(flags: Record<string, any>) {
    const defaultName = this.data.project?.name ?? 'project-demo'

    this.data.factoryVersion = version

    this.data.project = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Project name',
        initial({ enquirer }: any) {
          return defaultName
        },
        validate(value: any) {
          const name = formatName(value)
          return (name && true) || 'please input a valid project name'
        }
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description',
        initial({ state }: any) {
          return `${state.answers.name} description`
        }
      },
      ...(this.features.length > 0
        ? [
            {
              type: 'MultiSelect',
              name: 'features',
              message: `Choose features for your project:`,
              hint: '(Use <space> to select, <return> to submit)',
              choices: this.features,
              result(names: string[]) {
                return this.map(names)
              }
            }
          ]
        : [])
    ] as any)

    this.data.project.features = this.data.project.features || {}
  }

  protected async writing() {
    const { project } = this.data
    console.log('\n')
    const writingSpinner = this.createSpinner(
      this.style.green(`start create project: ${project.name}\n`)
    ).start()

    // 获取指定template path下的文件列表
    const files = await glob(this.globPath, {
      cwd: process.cwd(),
      dot: true,
      absolute: true
    })

    // 创建项目
    await this.writingFiles(files)

    writingSpinner.succeed(
      this.style.green(`create project ${project.name} success!\n\n`)
    )
  }

  protected async installing(flags: Record<string, any>) {
    const { dependencies, devDependencies } = require(join(
      this.targetDir,
      'package.json'
    ))
    if (isValidObject(dependencies) || isValidObject(devDependencies)) {
      const env = this.context.get('env')
      const config = this.context.get('config')
      const packageManager = env.hasYarn ? 'yarn' : config.packageManager

      // if use yarn install, not need spinner
      const installSpinner = this.createSpinner(
        `${packageManager} install`
      ).start()
      try {
        await this.installDeps(this.targetDir, packageManager, false)
        installSpinner.succeed('install dependencies success!\n')
      } catch (err) {
        installSpinner.fail('install dependencies fail!\n')
        this.error(err)
      }
    }
  }

  protected async ending() {
    const { project } = this.data
    const projectName = this.style.cyan.bold(project.name)
    if (this.errors) {
      this.spinner.fail(`Failed to created project ${projectName}.`)
      this.error(this.errors)
    }

    console.log(`
Next steps:`)

    if (this.data.subDirectory) {
      console.log(`
  $ ${this.style.cyan('cd ' + this.data.subDirectory)}`)
    }

    if (this.id === 'service') {
      console.log(`
  $ ${this.style.cyan('yarn setup')}`)
    }

    console.log(`
  $ ${this.style.cyan('yarn dev')} ${this.style.dim('launch the development server')}`)

    console.log(`
  $ ${this.style.cyan('yarn build')} ${this.style.dim('build project for production')}
  `)
  }
}
