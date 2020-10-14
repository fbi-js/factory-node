"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = require("path");
const ejs = tslib_1.__importStar(require("ejs"));
const fbi_1 = require("fbi");
const { formatName, isValidObject } = fbi_1.utils;
class TemplateDal extends fbi_1.Template {
    constructor(factory) {
        super();
        this.factory = factory;
        this.id = 'dal';
        this.description = 'template for DAL application using @mrapi/dal';
        this.path = 'templates/dal';
        this.renderer = ejs.render;
        this.templates = [];
    }
    async gathering() {
        this.data.project = await this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Input the project name',
                initial({ enquirer }) {
                    return 'my-dal';
                },
                validate(value) {
                    const name = formatName(value);
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
            },
            {
                type: 'MultiSelect',
                name: 'features',
                message: `Choose features for your project:`,
                hint: '(Use <space> to select, <return> to submit)',
                choices: [{ name: 'multi-tenant', value: true }],
                result(names) {
                    return this.map(names);
                }
            }
        ]);
        const { factory, project } = this.data;
        this.spinner = this.createSpinner(`Creating project...`).start(`Creating ${this.style.bold.green(project.name)} via ${factory.id} from ${factory.template}...`);
    }
    async writing() {
        const { project } = this.data;
        const debug = !!this.context.get('debug');
        const isMultiTenant = project.features['multi-tenant'];
        this.files = {
            copy: [
                ...(isMultiTenant
                    ? ['config/blog.prisma', 'config/music.prisma', 'config/management.prisma']
                    : ['config/default.prisma']),
                'scripts/*',
                'src/*',
                '.gitignore',
                'README.md',
                'tsconfig.json'
            ],
            render: ['package.json', '.fbi.config.js', 'mrapi.config.js'],
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
  $ ${this.style.cyan('npm run generate')} ${this.style.dim('generate the files needed for the service')}`);
        console.log(`
  $ ${this.style.cyan('npm run migrate')} ${this.style.dim('migrate schema save or up to database')}`);
        console.log(`
  $ ${this.style.cyan('npm run dev')} ${this.style.dim('launch the serve')}`);
        console.log(`
  $ ${this.style.cyan('npm run  build')} ${this.style.dim('build project')}`);
    }
}
exports.default = TemplateDal;
