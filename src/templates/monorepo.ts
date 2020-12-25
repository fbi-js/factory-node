import { join } from 'path'
import Factory from '..'
import BaseClass from './base'

export default class TemplateMonorepo extends BaseClass {
  id = 'monorepo'
  path = join(__dirname, '../../templates/monorepo')
  description = 'TypeScript monorepo with lerna and yarn workspace'
  templates = []
  features = []

  constructor(public factory: Factory) {
    super(factory)
  }

  protected async gathering(flags: Record<string, any>) {
    await super.gathering(flags)

    const { factory, project } = this.data
    this.spinner = this.createSpinner(`Creating project...`).start(
      `Creating ${this.style.bold.green(project.name)} via ${factory.id} from ${
        factory.template
      }...`
    )
  }

  protected async writing() {
    const debug = !!this.context.get('debug')
    const isJs = this.data.project?.features?.javascript

    this.files = {
      copy: ['.gitignore', isJs ? '' : 'tsconfig.json', 'lerna.json', 'packages/*'].filter(Boolean),
      render: [
        'package.json',
        'README.md'
      ].filter(Boolean),
      renderOptions: {
        async: true,
        debug,
        compileDebug: debug
      }
    }
  }
}
