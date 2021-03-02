import { join } from 'path'
import Factory from '..'
import BaseClass from './base'

export default class TemplateApp extends BaseClass {
  id = 'app'
  path = join(__dirname, '../../templates/app')
  description = 'template for Node.js application'
  templates = []
  features = []

  constructor(public factory: Factory) {
    super(factory)
  }

  protected async gathering(flags: Record<string, any>) {
    await super.gathering(flags)
  }
}
