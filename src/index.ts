import { join } from 'path'
import { Factory } from 'fbi'
import CommandBuild from './commands/build'
import CommandServe from './commands/serve'
import CommandDb from './commands/db'
import CommandGenerate from './commands/generate'
import TemplateGraphql from './templates/graphql'
import TemplateAdmin from './templates/admin'
import TemplateApiBasic from './templates/api-basic'
import TemplateApiCombine from './templates/api-combine'
import TemplateDalBasic from './templates/dal-basic'
// @ts-ignore
import { version } from '../package.json'

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
    new TemplateGraphql(this),
    new TemplateAdmin(this),
    new TemplateApiBasic(this),
    new TemplateApiCombine(this),
    new TemplateDalBasic(this)
  ]

  execOpts: any = {
    cwd: process.cwd(),
    localDir: join(__dirname, '../'),
    preferLocal: true
  }
}
