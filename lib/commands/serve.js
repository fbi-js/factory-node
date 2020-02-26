"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fbi_1 = require("fbi");
class CommandServe extends fbi_1.Command {
    constructor(factory) {
        super();
        this.factory = factory;
        this.id = 'serve';
        this.alias = 's';
        this.args = '';
        this.flags = [];
        this.description = 'command serve description';
    }
    async run(args, flags) {
        this.debug(`Factory: (${this.factory.id})`, 'from command', `"${this.id}"`);
        this.logStart(`Starting development server:`);
        const execOpts = {
            ...this.factory.execOpts,
            stdio: 'inherit'
        };
        try {
            this.clear();
            await this.exec.command(`ts-node-dev --clear --respawn --prefer-ts --transpile-only${flags.debug ? ' --debug' : ''} src/index.ts`, execOpts);
        }
        catch (err) {
            this.error('Failed to starting server');
            this.error(err).exit();
        }
    }
}
exports.default = CommandServe;
