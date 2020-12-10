import Factory from '..'
import BaseClass from './base'

export default class TemplateApp extends BaseClass {
  id = 'app'
  path = 'templates/app'
  description = 'template for Node.js application'
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
}
