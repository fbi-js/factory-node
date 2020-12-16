import { join } from 'path'
import { Factory } from 'fbi'

import CommandServe from './commands/serve'

import TemplateBase from './templates/base'
import TemplateApp from './templates/app'
import TemplateService from './templates/service'
import TemplateGateway from './templates/gateway'

const { name, description } = require('../package.json')

export default class FactoryNode extends Factory {
  id = name
  description = description
  commands = [new CommandServe(this)]
  templates = [new TemplateApp(this), new TemplateService(this), new TemplateGateway(this)]

  execOpts = {
    cwd: process.cwd(),
    localDir: join(__dirname, '../'),
    preferLocal: true
  }
}

export { CommandServe, TemplateBase, TemplateApp, TemplateService, TemplateGateway }
