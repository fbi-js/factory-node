"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = require("path");
const fbi_1 = require("fbi");
const ejs = tslib_1.__importStar(require("ejs"));
const utils_1 = require("fbi/lib/utils");
class TemplateFactory extends fbi_1.Template {
    constructor(factory) {
        super();
        this.factory = factory;
        this.id = 'api-basic';
        this.description = 'template for api-basic';
        this.path = 'templates/api/api-basic';
        this.renderer = ejs.render;
        this.templates = [];
    }
    async gathering() {
        // 获取暂存的项目参数
        this.data.project = this.configStore.get('projectInfo');
        const { factory, project } = this.data;
        project.features = [];
        this.spinner = this.createSpinner(`Creating project...`).start(`Creating ${this.style.bold.green(project.name)} via ${factory.id} from ${factory.template}...`);
    }
    async writing() {
        // const { project } = this.data
        // if (project.features.vue) {
        this.files = {
            copy: ['config/*', 'src/*', '.gitignore', '.meshrc.js', 'README.md', 'tsconfig.json'],
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
  $ ${this.style.cyan('fbi s')} ${this.style.dim('launch the serve')}`);
        console.log(`
  $ ${this.style.cyan('fbi b')} ${this.style.dim('build project')}`);
        //   console.log(`
        // $ ${this.style.cyan('fbi-next list')} ${this.style.dim(
        //     'show available commands and sub templates'
        //   )}`)
    }
}
exports.default = TemplateFactory;
