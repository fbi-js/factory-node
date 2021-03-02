"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const base_1 = __importDefault(require("./base"));
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
];
class TemplateService extends base_1.default {
    constructor(factory) {
        super(factory);
        this.factory = factory;
        this.id = 'service';
        this.path = path_1.join(__dirname, '../../templates/service');
        this.description = 'template for API service';
        this.templates = [];
        this.choices = [
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
        ];
    }
    async gathering(flags) {
        var _a;
        await super.gathering(flags);
        const { type } = (await this.prompt([
            {
                type: 'select',
                name: 'type',
                message: 'Service type',
                hint: 'Use arrow-keys, <return> to submit',
                choices: this.choices,
                result() {
                    return this.focused.value;
                }
            }
        ]));
        this.data.project.features['type'] = type;
        if (type !== 'aggregation') {
            const { multiModules } = (await this.prompt([
                {
                    type: 'confirm',
                    name: 'multiModules',
                    message: 'Need multiple modules'
                }
            ]));
            this.data.project.features['multiModules'] = multiModules;
            if (type === 'prisma') {
                const { multiTenants } = (await this.prompt([
                    {
                        type: 'confirm',
                        name: 'multiTenants',
                        message: 'Need multiple tenants'
                    }
                ]));
                this.data.project.features['multiTenants'] = multiTenants;
            }
        }
        const { features } = (await this.prompt({
            type: 'MultiSelect',
            name: 'features',
            message: `Choose features:`,
            hint: '(Use <space> to select, <return> to submit)',
            choices: (_a = this.choices.find((x) => x.value === type)) === null || _a === void 0 ? void 0 : _a.children,
            result(names) {
                return this.map(names);
            }
        }));
        this.data.project.features = Object.assign(Object.assign({}, this.data.project.features), features);
    }
    async writing() {
        await super.writing();
        // const { type, multiModules, multiTenants, graphql, openapi } = this.data.project.features
        // this.files.render = [
        //   'package.json',
        //   'README.md',
        //   'src/app.ts',
        //   {
        //     from: `configs/${type}.ts`,
        //     to: './mrapi.config.ts'
        //   }
        // ].filter(Boolean)
        // // ./prisma
        // if (type === 'prisma') {
        //   this.files.render.push({
        //     from: 'prisma/service/schema.prisma',
        //     to: multiModules || multiTenants ? './prisma/blog/schema.prisma' : './prisma/schema.prisma'
        //   })
        //   if (multiTenants) {
        //     this.files.render.push({
        //       from: 'prisma/management/schema.prisma',
        //       to: './prisma/management/schema.prisma'
        //     })
        //   }
        // }
        // // src/service
        // if (multiModules) {
        //   if (graphql) {
        //     this.files.render.push({
        //       from: 'src/service/graphql/*',
        //       to: 'src/blog/graphql'
        //     })
        //     this.files.render.push({
        //       from: 'src/common/graphql/*',
        //       to: 'src/common/graphql'
        //     })
        //   }
        //   if (openapi) {
        //     this.files.render.push({
        //       from: 'src/service/openapi/*',
        //       to: 'src/blog/openapi'
        //     })
        //     this.files.render.push({
        //       from: 'src/common/openapi/*',
        //       to: 'src/common/openapi'
        //     })
        //   }
        // } else {
        //   if (graphql) {
        //     this.files.render.push({
        //       from: 'src/service/graphql/*',
        //       to: './src/graphql'
        //     })
        //   }
        //   if (openapi) {
        //     this.files.render.push({
        //       from: 'src/service/openapi/*',
        //       to: './src/openapi'
        //     })
        //   }
        // }
    }
}
exports.default = TemplateService;
//# sourceMappingURL=service.js.map