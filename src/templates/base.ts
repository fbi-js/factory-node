import Factory from '..'
import * as ejs from 'ejs'
import { join } from 'path'
import { Template, utils } from 'fbi'

const { formatName, isValidObject } = utils
const { version } = require('../../package.json')

export default class TemplateNodeBase extends Template {
  id = 'node-base'
  renderer = ejs.render
  features: any[] = []

  constructor(public factory: Factory) {
    super()
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
    const debug = !!this.context.get('debug')
    const isJs = this.data.project?.features?.javascript

    this.files = {
      copy: ['.gitignore', '.editorconfig', '.prettierignore', isJs ? '' : 'tsconfig.json'].filter(
        Boolean
      ),
      render: [
        'package.json',
        'mrapi.config.ts',
        'mrapi.config.js',
        'README.md',
        {
          from: `src${isJs ? '-js' : ''}/**/*`,
          to: 'src'
        }
      ].filter(Boolean),
      renderOptions: {
        async: true,
        debug,
        compileDebug: debug
      }
    }
  }

  protected async installing(flags: Record<string, any>) {
    const { project } = this.data
    this.spinner.succeed(`Created project ${this.style.cyan.bold(project.name)}`)

    const { dependencies, devDependencies } = require(join(this.targetDir, 'package.json'))
    if (isValidObject(dependencies) || isValidObject(devDependencies)) {
      const installSpinner = this.createSpinner(`Installing dependencies...`).start()
      try {
        await this.installDeps(this.targetDir, flags.packageManager, false)
        installSpinner.succeed(`Installed dependencies`)
      } catch (err) {
        installSpinner.fail('Failed to install dependencies. You can install them manually.')
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
Next steps:
  $ ${this.style.cyan('cd ' + project.name)}`)

    if (this.id === 'service') {
      console.log(`
  $ ${this.style.cyan('yarn setup')}`)
    }

    console.log(`
  $ ${this.style.cyan('yarn dev')} ${this.style.dim('launch the serve')}`)

    console.log(`
  $ ${this.style.cyan('yarn build')} ${this.style.dim('build project')}`)
  }
}
