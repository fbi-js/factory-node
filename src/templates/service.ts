import Factory from '..'
import BaseClass from './base'

export default class TemplateService extends BaseClass {
  id = 'service'
  path = 'templates/service'
  description = 'template for API service'
  templates = []
  features = [
    { name: 'graphql', value: true },
    { name: 'openapi', value: true },
    { name: 'prisma', value: true },
    { name: 'multiple', value: true },
    { name: 'mesh', value: true }
  ]

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
