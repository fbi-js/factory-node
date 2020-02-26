"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fbi_1 = require("fbi");
class CommandGenerate extends fbi_1.Command {
    constructor(factory) {
        super();
        this.factory = factory;
        this.id = 'generate';
        this.alias = 'g';
        this.args = '';
        this.flags = [];
        this.description = 'command generate description';
    }
    async run(args, flags) {
        this.debug(`Factory: (${this.factory.id})`, 'from command', `"${this.id}"`);
        this.logStart(`Start generating:`);
        const execOpts = {
            ...this.factory.execOpts,
            stdio: flags.debug ? 'inherit' : 'pipe'
        };
        this.logItem('prisma client files...');
        await this.exec.command('prisma2 generate', execOpts);
        this.logItem('typescript nexus...');
        await this.exec.command('cnt --mq -f -o', execOpts);
        this.logItem('typescript types...');
        await this.exec.command('create-types', execOpts);
        this.logItem('nexus files...');
        await this.exec.command('ts-node --transpile-only src/schema', execOpts);
        this.logEnd('Generated successfully');
    }
}
exports.default = CommandGenerate;
