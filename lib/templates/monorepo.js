"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const base_1 = __importDefault(require("./base"));
class TemplateMonorepo extends base_1.default {
    constructor(factory) {
        super(factory);
        this.factory = factory;
        this.id = 'monorepo';
        this.path = path_1.join(__dirname, '../../templates/monorepo');
        this.description = 'TypeScript monorepo with lerna and yarn workspace';
        this.templates = [];
        this.features = [];
    }
    async gathering(flags) {
        await super.gathering(flags);
        const { factory, project } = this.data;
        this.spinner = this.createSpinner(`Creating project...`).start(`Creating ${this.style.bold.green(project.name)} via ${factory.id} from ${factory.template}...`);
    }
    async writing() {
        var _a, _b;
        const debug = !!this.context.get('debug');
        const isJs = (_b = (_a = this.data.project) === null || _a === void 0 ? void 0 : _a.features) === null || _b === void 0 ? void 0 : _b.javascript;
        this.files = {
            copy: ['.gitignore', isJs ? '' : 'tsconfig.json', 'lerna.json', 'packages/*'].filter(Boolean),
            render: [
                'package.json',
                'README.md'
            ].filter(Boolean),
            renderOptions: {
                async: true,
                debug,
                compileDebug: debug
            }
        };
    }
}
exports.default = TemplateMonorepo;
