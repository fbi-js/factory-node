import { join } from 'path'
import { Factory } from 'fbi'
import CommandBuild from './commands/build'
import CommandServe from './commands/serve'
import CommandDb from './commands/db'
import CommandGenerate from './commands/generate'
import TemplateGraphql from './templates/graphql'

export default class FactoryNode extends Factory {
  id = 'node'
  description = 'factory for node.js application development'
  commands = [
    new CommandBuild(this),
    new CommandServe(this),
    new CommandDb(this),
    new CommandGenerate(this)
  ]
  templates = [new TemplateGraphql(this)]

  execOpts: any = {
    cwd: process.cwd(),
    localDir: join(__dirname, '../'),
    preferLocal: true
  }

  get nodeModulesPath() {
    return join(__dirname, '../node_modules')
  }

  get prismaBin() {
    // return join(this.nodeModulesPath, '.bin/prisma2')
    return 'prisma2'
  }

  get tsnodeBin() {
    // return join(this.nodeModulesPath, '.bin/ts-node')
    return 'ts-node'
  }

  get tsnodedevBin() {
    // return join(this.nodeModulesPath, '.bin/ts-node-dev')
    return 'ts-node-dev'
  }

  get cntBin() {
    // return join(this.nodeModulesPath, '.bin/cnt')
    return 'cnt'
  }

  get createTypesBin() {
    // return join(this.nodeModulesPath, '.bin/create-types')
    return 'create-types'
  }
}
