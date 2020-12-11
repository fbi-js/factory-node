import { join } from 'path'
import { Factory } from 'fbi'

import CommandServe from './commands/serve'

import TemplateApp from './templates/app'
import TemplateService from './templates/service'
import TemplateGateway from './templates/gateway'

export default class FactoryNode extends Factory {
  id = 'factory-node'
  description = 'factory for node.js application development'
  commands = [new CommandServe(this)]
  templates = [new TemplateApp(this), new TemplateService(this), new TemplateGateway(this)]

  execOpts = {
    cwd: process.cwd(),
    localDir: join(__dirname, '../'),
    preferLocal: true
  }
}
