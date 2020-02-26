"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fbi_1 = require("fbi");
class CommandDb extends fbi_1.Command {
    constructor(factory) {
        super();
        this.factory = factory;
        this.id = 'db';
        this.alias = 'd';
        this.args = '';
        this.flags = [
            ['-u, --up', 'Apply any migrations that have not been applied yet'],
            ['-d, --down', 'Undo migrations']
        ];
        this.description = 'database migrations';
    }
    async run(args, flags) {
        this.debug(`Factory: (${this.factory.id})`, 'from command', `"${this.id}"`, { args, flags });
        let action = 'up';
        if (!flags.up && !flags.down) {
            const ret = await this.prompt({
                type: 'select',
                name: 'action',
                message: 'Choose an action:',
                hint: 'Use arrow-keys, <return> to submit',
                choices: ['up', 'down']
            });
            action = ret.action;
        }
        this.logStart(`Start database migrate ${action}...`);
        const execOpts = {
            ...this.factory.execOpts,
            stdio: 'inherit'
        };
        switch (action) {
            case 'up':
                await this.exec.command('prisma2 migrate save --name "" --experimental', execOpts);
                await this.exec.command('prisma2 migrate up --experimental', execOpts);
                break;
            case 'down':
                await this.exec.command('prisma2 migrate down --experimental', execOpts);
                break;
        }
        this.logEnd('database migrate successfully');
    }
}
exports.default = CommandDb;
