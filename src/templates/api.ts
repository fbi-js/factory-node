import { join } from 'path'
import * as ejs from 'ejs'
import { Template, utils } from 'fbi'

import Factory from '..'

const { formatName, isValidObject } = utils

export default class TemplateApi extends Template {
  id = 'api'
  description = 'template for API application using @mrapi/api'
  path = 'templates/api'
  renderer = ejs.render
  templates = []

  constructor(public factory: Factory) {
    super()
  }

  protected async gathering() {
    this.data.project = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Input the project name',
        initial({ enquirer }: any) {
          return 'my-api'
        },
        validate(value: any) {
          const name = formatName(value)
          return (name && true) || 'please input a valid project name'
        }
      },
      {
        type: 'input',
        name: 'description',
        message: 'Input project description',
        initial({ state }: any) {
          return `${state.answers.name} description`
        }
      },
      {
        type: 'MultiSelect',
        name: 'features',
        message: `Choose features for your project:`,
        hint: '(Use <space> to select, <return> to submit)',
        choices: [{ name: 'combined', value: true }],
        result(names: string[]) {
          return this.map(names)
        }
      }
    ] as any)

    const { factory, project } = this.data
    this.spinner = this.createSpinner(`Creating project...`).start(
      `Creating ${this.style.bold.green(project.name)} via ${factory.id} from ${
        factory.template
      }...`
    )
  }

  protected async writing() {
    const { project } = this.data
    const debug = !!this.context.get('debug')
    const isCombined = project.features['combined']

    this.files = {
      copy: [
        ...(isCombined ? ['config/*', 'src/*.ts', 'src/graphql/*.ts', 'src/openapi/*'] : ['src/*']),
        'src/*.ts',
        'examples/*',
        '.gitignore',
        'README.md',
        'tsconfig.json'
      ],
      render: ['package.json', '.fbi.config.js', 'mrapi.config.js'],
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

    if (this.data.project.features['combined']) {
      console.log(`
  $ ${this.style.cyan('npm run generate')} ${this.style.dim(
        'generate the files needed for the service'
      )}`)

      console.log(`
  $ ${this.style.cyan('npm run migrate')} ${this.style.dim(
        'migrate schema save or up to database'
      )}`)
    }

    console.log(`
  $ ${this.style.cyan('npm run dev')} ${this.style.dim('launch the serve')}`)

    console.log(`
  $ ${this.style.cyan('npm run  build')} ${this.style.dim('build project')}`)
  }
}
