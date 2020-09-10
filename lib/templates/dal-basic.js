"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fbi_1 = require("fbi");
const ejs = require("ejs");
const utils_1 = require("fbi/lib/utils");
class TemplateFactory extends fbi_1.Template {
    constructor(factory) {
        super();
        this.factory = factory;
        this.id = 'dal-basic';
        this.description = 'template for dal-basic';
        this.path = 'templates/dal-basic';
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
                    return 'project-demo';
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
        const { factory, project } = this.data;
        project.features = [];
        this.spinner = this.createSpinner(`Creating project...`).start(`Creating ${this.style.bold.green(project.name)} via ${factory.id} from ${factory.template}...`);
    }
    async writing() {
        // const { project } = this.data
        // if (project.features.vue) {
        this.files = {
            copy: ['config/*', 'src/*', '.gitignore', 'README.md', 'tsconfig.json'],
            render: ['package.json', '.fbi.config.js'],
            renderOptions: {
                async: true
            }
        };
        // }
    }
    async installing(flags) {
        const { project } = this.data;
        this.spinner.succeed(`Created project ${this.style.cyan.bold(project.name)}`);
        const { dependencies, devDependencies } = require(path_1.join(this.targetDir, 'package.json'));
        if (utils_1.isValidObject(dependencies) || utils_1.isValidObject(devDependencies)) {
            const installSpinner = this.createSpinner(`Installing dependencies...`).start();
            try {
                const packageManager = flags.packageManager || this.context.get('config').packageManager;
                const cmds = packageManager === 'yarn' ? [packageManager] : [packageManager, 'install'];
                this.debug(`\nrunning \`${cmds.join(' ')}\` in ${this.targetDir}`);
                await this.exec(cmds[0], cmds.slice(1), {
                    cwd: this.targetDir
                });
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
  $ ${this.style.cyan('cd ' + project.name)}
  `);
        console.log(`
  $ ${this.style.cyan('npm run dev')} ${this.style.dim('launch the serve')}`);
        console.log(`
  $ ${this.style.cyan('npm run  build')} ${this.style.dim('build project')}`);
        //   console.log(`
        // $ ${this.style.cyan('fbi-next list')} ${this.style.dim(
        //     'show available commands and sub templates'
        //   )}`)
    }
}
exports.default = TemplateFactory;
