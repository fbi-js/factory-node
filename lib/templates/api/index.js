"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fbi_1 = require("fbi");
const ejs = tslib_1.__importStar(require("ejs"));
const utils_1 = require("fbi/lib/utils");
const api_basic_1 = tslib_1.__importDefault(require("./api-basic"));
const api_combine_1 = tslib_1.__importDefault(require("./api-combine"));
class TemplateWeb extends fbi_1.Template {
    constructor(factory) {
        super();
        this.factory = factory;
        this.id = 'api';
        this.description = 'template for factory-node api';
        this.path = 'templates/api/index';
        this.renderer = ejs.render;
        this.templates = [new api_basic_1.default(this.factory), new api_combine_1.default(this.factory)];
        this.projectInfo = {};
    }
    async gathering(flags) {
        var _a, _b, _c, _d;
        const defaultName = this.data.project && this.data.project.name || 'project-demo';
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
                result(names) {
                    return this.map(names);
                }
            },
            {
                type: 'input',
                name: 'name',
                message: 'Input the project name',
                initial({ enquirer }) {
                    return defaultName;
                },
                validate(value) {
                    const name = utils_1.formatName(value);
                    return (name && true) || 'please input a valid project name';
                }
            },
            {
                type: 'input',
                name: 'description',
                message: 'Input project description',
                initial({ state }) {
                    return `${state.answers.name} description`;
                }
            }
        ]);
        this.projectInfo.nameCapitalized = utils_1.capitalizeEveryWord(this.projectInfo.name);
        const project = this.projectInfo;
        try {
            this.configStore.set("projectInfo", project);
        }
        catch {
            // 若写入项目信息数据失败，终止后续流程
            return;
        }
        const temps = fbi_1.utils.flatten(this.factory.templates.map((f) => f.templates));
        const choiceId = project.features.standalone ? 'api-basic' : 'api-combine';
        const choiseTemp = temps.find((it) => it.id === choiceId);
        if (choiseTemp) {
            // set init data
            const factoryInfo = this.store.get(choiseTemp.factory.id);
            const info = await choiseTemp.run({
                factory: {
                    id: factoryInfo.id,
                    path: ((_b = (_a = factoryInfo.version) === null || _a === void 0 ? void 0 : _a.latest) === null || _b === void 0 ? void 0 : _b.dir) || factoryInfo.path,
                    version: (_d = (_c = factoryInfo.version) === null || _c === void 0 ? void 0 : _c.latest) === null || _d === void 0 ? void 0 : _d.short,
                    template: choiceId
                }
            }, flags);
            if (!info) {
                return;
            }
            // 清除暂存的项目数据
            this.configStore.del('projectInfo');
            // update store
            this.debug(`Save info into project store`);
            if (info.path) {
                this.projectStore.merge(info.path, {
                    features: info.features,
                    updatedAt: Date.now()
                });
            }
        }
        else {
            this.error(`template ${choiceId} not found`).exit();
        }
    }
}
exports.default = TemplateWeb;