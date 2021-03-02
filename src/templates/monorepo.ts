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
  }
}
