"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = require("path");
const fbi_1 = require("fbi");
const ejs = tslib_1.__importStar(require("ejs"));
const utils_1 = require("fbi/lib/utils");
class TemplateGraphql extends fbi_1.Template {
    constructor(factory) {
        super();
        this.factory = factory;
        this.id = 'prisma';
        this.description = 'prisma template for graphql template';
        this.path = 'templates/graphql';
        this.renderer = ejs.render;
    }
    async gathering() {
        const factory = this.context.get('config.factory');
        console.log(this.store.get(factory.id));
        this.features = (factory === null || factory === void 0 ? void 0 : factory.features) || {};
        this.data.project = {};
        let folder = 'prisma';
        if (this.features.prisma || (await this.fs.pathExists(path_1.join(this.targetDir, folder)))) {
            const ret = await this.prompt([
                {
                    type: 'input',
                    name: 'folder',
                    message: 'Already have prisma in the project, please input another name for prisma folder:',
                    validate: async (value, state) => {
                        const name = utils_1.formatName(value);
                        if (await this.fs.pathExists(path_1.join(this.targetDir, name))) {
                            return state.styles.danger(`path "${name}" already exist`);
                        }
                        return (name && true) || state.styles.danger('please input a valid folder name');
                    }
                }
            ]);
            folder = ret.folder;
        }
        this.data.project.folder = folder;
        this.data.project['database'] = await this._promptDB();
        this.spinner = this.createSpinner(`Creating prisma...`).start(`Creating ${this.style.bold.green('prisma')} via ${this.id} from ${factory.template}...`);
    }
    async writing() {
        this.targetDir = process.cwd();
        const { project } = this.data;
        this.files = {
            render: [
                {
                    from: 'prisma/**/*',
                    to: project.folder
                }
            ],
            renderOptions: {
                async: true
            }
        };
    }
    async installing(flags) {
        const { project } = this.data;
        this.spinner.succeed(`Created prisma in folder ${this.style.cyan.bold(project.folder)}`);
        const installSpinner = this.createSpinner(`Installing dependencies...`).start();
        try {
            const packageManager = flags.packageManager || this.context.get('config').packageManager;
            const cmds = packageManager === 'yarn' ? packageManager : `${packageManager} install`;
            this.debug(`\nrunning \`${cmds}\` in ${this.targetDir}`);
            await this.exec.command(cmds, {
                cwd: this.targetDir
            });
            installSpinner.succeed(`Installed dependencies`);
        }
        catch (err) {
            installSpinner.fail('Failed to install dependencies. You can install them manually.');
            this.error(err);
        }
    }
    async ending() {
        const { project } = this.data;
        const projectName = this.style.cyan.bold(project.folder);
        if (this.errors) {
            this.spinner.fail(`Failed to created prisma in folder ${projectName}.`);
            this.error(this.errors);
        }
        console.log(`
Next steps:`);
        console.log(`  modify "./prisma/schema.prisma" and "./prisma/seed.ts"`);
        console.log(`  ${this.style.bold('$')} ${this.style.cyan('fbi d -u')}`);
        console.log(`  ${this.style.bold('$')} ${this.style.cyan('fbi g')}`);
        console.log(`  ${this.style.bold('$')} ${this.style.cyan('fbi s')}`);
        console.log(`
  $ ${this.style.cyan('fbi list')} ${this.style.dim('show available commands and sub templates')}`);
        // TODO: update paroject config's features
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
                { name: 'host', message: 'host', initial: '' },
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
            dbUrlChoices.push({ name: 'schema', message: 'schema', initial: '' });
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
