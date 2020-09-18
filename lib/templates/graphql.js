"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = require("path");
const fbi_1 = require("fbi");
const ejs = tslib_1.__importStar(require("ejs"));
const utils_1 = require("fbi/lib/utils");
const prisma_1 = tslib_1.__importDefault(require("./graphql/prisma"));
class TemplateGraphql extends fbi_1.Template {
    constructor(factory) {
        super();
        this.factory = factory;
        this.id = 'graphql';
        this.description = 'template graphql description';
        this.path = 'templates/graphql';
        this.renderer = ejs.render;
        this.templates = [new prisma_1.default(this.factory)];
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
            },
            {
                type: 'MultiSelect',
                name: 'features',
                message: `Pick features for your project:`,
                hint: '(Use <space> to select, <return> to submit)',
                choices: [
                    { name: 'prisma', value: true },
                    { name: 'nexus', value: true },
                    { name: 'permissions', value: true }
                ],
                result(names) {
                    return this.map(names);
                }
            }
        ]);
        const { factory, project } = this.data;
        if (project.features.prisma) {
            project['database'] = await this._promptDB();
        }
        this.spinner = this.createSpinner(`Creating project...`).start(`Creating ${this.style.bold.green(project.name)} via ${factory.id} from ${factory.template}...`);
    }
    async writing() {
        const { project } = this.data;
        this.files = {
            copy: ['.editorconfig', '.prettierrc', '.gitignore', 'tsconfig.json'],
            render: [
                'package.json',
                'README.md',
                'src/*',
                'src/**/*/!(auth.ts|permissions.ts)',
                project.features.prisma ? 'prisma/**/*' : '',
                ...(project.features.permissions
                    ? ['src/graphql-custom/auth.ts', 'src/middlewares/permissions.ts']
                    : [])
            ],
            renderOptions: {
                async: true
            }
        };
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
        if (project.features.prisma) {
            console.log(`  modify "./prisma/schema.prisma" and "./prisma/seed.ts"`);
            console.log(`  ${this.style.bold('$')} ${this.style.cyan('fbi d -u')}`);
            console.log(`  ${this.style.bold('$')} ${this.style.cyan('fbi g')}`);
        }
        console.log(`  ${this.style.bold('$')} ${this.style.cyan('fbi s')}`);
        console.log(`
  $ ${this.style.cyan('fbi list')} ${this.style.dim('show available commands and sub templates')}`);
    }
    async _promptDB() {
        // db type
        const { provider } = await this.prompt([
            {
                type: 'select',
                name: 'provider',
                message: 'Pick a database type',
                hint: 'Use arrow-keys, <return> to submit',
                choices: [
                    {
                        name: 'PostgreSQL',
                        value: 'postgresql'
                    },
                    {
                        name: 'MySQL',
                        value: 'mysql'
                    },
                    {
                        name: 'SQLite',
                        value: 'sqlite'
                    }
                ],
                result(name) {
                    return this.focused.value;
                }
            }
        ]);
        // db info
        let dbUrlChoices = [];
        if (provider === 'postgresql' || provider === 'mysql') {
            dbUrlChoices = dbUrlChoices.concat([
                { name: 'host', message: 'host', initial: 'localhost' },
                {
                    name: 'port',
                    message: 'port',
                    initial: provider === 'postgresql' ? '5432' : '3306'
                },
                { name: 'user', message: 'user', initial: '' },
                { name: 'password', message: 'password', initial: '' },
                { name: 'database', message: 'database', initial: '' }
            ]);
        }
        else {
            dbUrlChoices.push({ name: 'file', message: 'file', initial: 'dev' });
            dbUrlChoices.push({
                name: 'url',
                message: 'database url',
                disabled: true,
                onChoice(state, choice, i) {
                    const { file } = this.values;
                    choice.initial = `file:./${file}.db`;
                }
            });
        }
        if (provider === 'postgresql') {
            dbUrlChoices.push({ name: 'schema', message: 'schema', initial: 'public' });
            dbUrlChoices.push({
                name: 'url',
                message: 'database url',
                disabled: true,
                onChoice(state, choice, i) {
                    const { host, port, user, password, database, schema } = this.values;
                    choice.initial = `postgresql://${user}:${password}@${host}:${port}/${database}?schema=${schema}`;
                }
            });
        }
        if (provider === 'mysql') {
            dbUrlChoices.push({
                name: 'url',
                message: 'database url',
                disabled: true,
                onChoice(state, choice, i) {
                    const { host, port, user, password, database } = this.values;
                    choice.initial = `mysql://${user}:${password}@${host}:${port}/${database}`;
                }
            });
        }
        const { dbInfo } = await this.prompt({
            type: 'form',
            name: 'dbInfo',
            message: 'Please provide the database connection information:',
            choices: dbUrlChoices
        });
        return {
            ...dbInfo,
            provider
        };
    }
}
exports.default = TemplateGraphql;
