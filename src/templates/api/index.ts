import { Template, utils } from 'fbi'
import * as ejs from 'ejs'
import Factory from '../..'
import { formatName, capitalizeEveryWord } from 'fbi/lib/utils'
import SubTemplateBasic from './api-basic'
import SubTemplateCombine from './api-combine'

export default class TemplateWeb extends Template {
  id = 'api'
  description = 'template for factory-node api'
  path = 'templates/api/index'
  renderer = ejs.render
  templates = [new SubTemplateBasic(this.factory), new SubTemplateCombine(this.factory)]

  public projectInfo:Record<string | number, any> = {}

  constructor(public factory: Factory) {
    super()
  }

  protected async gathering(flags: Record<string, any>) {
    const defaultName = this.data.project && this.data.project.name || 'project-demo'
    this.projectInfo = await this.prompt([
      {
        type: 'Select',
        name: 'features',
        message: `Which package usage mode do you want to choice?`,
        hint: '(Use <arrow> to select, <return> to submit)',
        choices: [
          { name: 'standalone', value: true },
          { name: 'combined', value: true }
        ],
        result(names: string[]) {
          return this.map(names)
        }
      },
      {
        type: 'input',
        name: 'name',
        message: 'Input the project name',
        initial({ enquirer }: any) {
          return defaultName
        },
        validate(value: any) {
          const name = formatName(value)
          return (name && true) || 'please input a valid project name'
        }
      },
      {
        type: 'input',
        name: 'description',
        message: 'Input project description',
        initial({ state }: any) {
          return `${state.answers.name} description`
        }
      }
    ] as any)

    this.projectInfo.nameCapitalized = capitalizeEveryWord(this.projectInfo.name)
    const project = this.projectInfo
    try {
      this.configStore.set("projectInfo", project)
    } catch {
      // 若写入项目信息数据失败，终止后续流程
      return
    }

    const temps = utils.flatten(this.factory.templates.map((f: any) => f.templates))
    const choiceId = project.features.standalone ? 'api-basic' :'api-combine'
    const choiseTemp = temps.find((it:any) => it.id === choiceId)

    if (choiseTemp) {
      // set init data
      const factoryInfo = this.store.get(choiseTemp.factory.id)
      const info: Record<string, any> = await choiseTemp.run(
        {
          factory: {
            id: factoryInfo.id,
            path: factoryInfo.version?.latest?.dir || factoryInfo.path,
            version: factoryInfo.version?.latest?.short,
            template: choiseTemp.factory.id
          }
        },
        flags
      )

      if (!info) {
        return
      }

      // 清除暂存的项目数据
      this.configStore.del('projectInfo')
      // update store
      this.debug(`Save info into project store`)
      if (info.path) {
        this.projectStore.merge(info.path, {
          features: info.features,
          updatedAt: Date.now()
        })
      }
    } else {
      this.error(`template ${choiceId} not found`).exit()
    }
  }


}

