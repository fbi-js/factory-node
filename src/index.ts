import { join } from 'path'
import { Factory } from 'fbi'

import CommandBuild from './commands/build'
import CommandServe from './commands/serve'
import CommandDb from './commands/db'
import CommandGenerate from './commands/generate'

import TemplateDal from './templates/dal'
import TemplateApi from './templates/api'
// import TemplateAdmin from './templates/admin'

export default class FactoryNode extends Factory {
  id = 'factory-node'
  description = 'factory for node.js application development'
  commands = [
    new CommandBuild(this),
    new CommandServe(this),
    new CommandDb(this),
    new CommandGenerate(this)
  ]
  templates = [
    new TemplateDal(this),
    new TemplateApi(this)
    //  new TemplateAdmin(this)
  ]

  execOpts: any = {
    cwd: process.cwd(),
    localDir: join(__dirname, '../'),
    preferLocal: true
  }
}
