import { join } from 'path'
import Factory from '..'
import BaseClass from './base'

const commonFeatures = [
  {
    name: 'graphql',
    value: true,
    hint: ''
  },
  {
    name: 'openapi',
    value: true,
    hint: ''
  }
]

export default class TemplateService extends BaseClass {
  id = 'service'
  path = join(__dirname, '../../templates/service')
  description = 'template for API service'
  templates = []
  choices = [
    {
      name: 'Simple',
      value: 'simple',
      hint: '',
      children: [...commonFeatures]
    },
    {
      name: 'Prisma',
      value: 'prisma',
      hint: '',
      children: [...commonFeatures]
    },
    {
      name: 'Aggregation',
      value: 'aggregation',
      hint: '',
      children: [...commonFeatures]
    }
  ]

  constructor(public factory: Factory) {
    super(factory)
  }

  protected async gathering(flags: Record<string, any>) {
    await super.gathering(flags)

    const { type } = (await this.prompt([
      {
        type: 'select',
        name: 'type',
        message: 'Service type',
        hint: 'Use arrow-keys, <return> to submit',
        choices: this.choices,
        result() {
          return this.focused.value
        }
      }
    ])) as any

    this.data.project.features['type'] = type

    if (type !== 'aggregation') {
      const { multiModules } = (await this.prompt([
        {
          type: 'confirm',
          name: 'multiModules',
          message: 'Need multiple modules'
        }
      ])) as any
      this.data.project.features['multiModules'] = multiModules

      if (type === 'prisma') {
        const { multiTenants } = (await this.prompt([
          {
            type: 'confirm',
            name: 'multiTenants',
            message: 'Need multiple tenants'
          }
        ])) as any
        this.data.project.features['multiTenants'] = multiTenants
      }
    }

    const { features } = (await this.prompt({
      type: 'MultiSelect',
      name: 'features',
      message: `Choose features:`,
      hint: '(Use <space> to select, <return> to submit)',
      choices: this.choices.find((x) => x.value === type)?.children,
      result(names: string[]) {
        return this.map(names)
      }
    } as any)) as any

    this.data.project.features = {
      ...this.data.project.features,
      ...features
    }

  }

  protected async writing() {
    await super.writing()
    const { type, multiModules, multiTenants, graphql, openapi } = this.data.project.features

    this.files.render = [
      'package.json',
      'README.md',
      'src/app.ts',
      {
        from: `configs/${type}.ts`,
        to: './mrapi.config.ts'
      }
    ].filter(Boolean)

    // ./prisma
    if (type === 'prisma') {
      this.files.render.push({
        from: 'prisma/service/schema.prisma',
        to: multiModules || multiTenants ? './prisma/blog/schema.prisma' : './prisma/schema.prisma'
      })

      if (multiTenants) {
        this.files.render.push({
          from: 'prisma/management/schema.prisma',
          to: './prisma/management/schema.prisma'
        })
      }
    }

    // src/service
    if (multiModules) {
      if (graphql) {
        this.files.render.push({
          from: 'src/service/graphql/*',
          to: 'src/blog/graphql'
        })
        this.files.render.push({
          from: 'src/common/graphql/*',
          to: 'src/common/graphql'
        })
      }
      if (openapi) {
        this.files.render.push({
          from: 'src/service/openapi/*',
          to: 'src/blog/openapi'
        })
        this.files.render.push({
          from: 'src/common/openapi/*',
          to: 'src/common/openapi'
        })
      }
    } else {
      if (graphql) {
        this.files.render.push({
          from: 'src/service/graphql/*',
          to: './src/graphql'
        })
      }
      if (openapi) {
        this.files.render.push({
          from: 'src/service/openapi/*',
          to: './src/openapi'
        })
      }
    }
  }
}
