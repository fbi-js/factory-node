import { join } from 'path'
import Factory from '..'
import BaseClass from './base'

export default class TemplateGateway extends BaseClass {
  id = 'gateway'
  path = join(__dirname, '../../templates/gateway')
  description = 'template for API gateway'
  templates = []
  features = [{ name: 'typescript', value: true }]

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
