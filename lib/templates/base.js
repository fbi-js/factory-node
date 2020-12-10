"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ejs = __importStar(require("ejs"));
const path_1 = require("path");
const fbi_1 = require("fbi");
const { formatName, isValidObject } = fbi_1.utils;
const { version } = require('../../package.json');
class TemplateNodeBase extends fbi_1.Template {
    constructor(factory) {
        super();
        this.factory = factory;
        this.id = 'node-base';
        this.renderer = ejs.render;
        this.features = [];
    }
    async gathering(flags) {
        var _a, _b;
        const defaultName = (_b = (_a = this.data.project) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'project-demo';
        this.data.factoryVersion = version;
        this.data.project = await this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Project name',
                initial({ enquirer }) {
                    return defaultName;
                },
                validate(value) {
                    const name = formatName(value);
                    return (name && true) || 'please input a valid project name';
                }
            },
            {
                type: 'input',
                name: 'description',
                message: 'Project description',
                initial({ state }) {
                    return `${state.answers.name} description`;
                }
            },
            ...(this.features.length > 0
                ? [
                    {
                        type: 'MultiSelect',
                        name: 'features',
                        message: `Choose features for your project:`,
                        hint: '(Use <space> to select, <return> to submit)',
                        choices: this.features,
                        result(names) {
                            return this.map(names);
                        }
                    }
                ]
                : [])
        ]);
        this.data.project.features = this.data.project.features || {};
    }
    async writing() {
        var _a, _b;
        const debug = !!this.context.get('debug');
        const isJs = (_b = (_a = this.data.project) === null || _a === void 0 ? void 0 : _a.features) === null || _b === void 0 ? void 0 : _b.javascript;
        this.files = {
            copy: ['.gitignore', '.editorconfig', '.prettierignore', isJs ? '' : 'tsconfig.json'].filter(Boolean),
            render: [
                'package.json',
                'mrapi.config.ts',
                'mrapi.config.js',
                'README.md',
                {
                    from: `src${isJs ? '-js' : ''}/**/*`,
                    to: 'src'
                }
            ].filter(Boolean),
            renderOptions: {
                async: true,
                debug,
                compileDebug: debug
            }
        };
    }
    async installing(flags) {
        const { project } = this.data;
        this.spinner.succeed(`Created project ${this.style.cyan.bold(project.name)}`);
        const { dependencies, devDependencies } = require(path_1.join(this.targetDir, 'package.json'));
        if (isValidObject(dependencies) || isValidObject(devDependencies)) {
            const installSpinner = this.createSpinner(`Installing dependencies...`).start();
            try {
                await this.installDeps(this.targetDir, flags.packageManager, false);
                installSpinner.succeed(`Installed dependencies`);
            }
            catch (err) {
                installSpinner.fail('Failed to install dependencies. You can install them manually.');
                this.error(err);
            }
        }
    }
    async ending() {
        const { project } = this.data;
        const projectName = this.style.cyan.bold(project.name);
        if (this.errors) {
            this.spinner.fail(`Failed to created project ${projectName}.`);
            this.error(this.errors);
        }
        console.log(`
Next steps:
  $ ${this.style.cyan('cd ' + project.name)}`);
        console.log(`
  $ ${this.style.cyan('npm run dev')} ${this.style.dim('launch the serve')}`);
        console.log(`
  $ ${this.style.cyan('npm run build')} ${this.style.dim('build project')}`);
    }
}
exports.default = TemplateNodeBase;