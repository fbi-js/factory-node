"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fbi_1 = require("fbi");
class CommandBuild extends fbi_1.Command {
    constructor(factory) {
        super();
        this.factory = factory;
        this.id = 'build';
        this.alias = 'b';
        this.args = '';
        this.flags = [];
        this.description = 'command build description';
    }
    async run(args, flags) {
        this.debug(`Factory: (${this.factory.id})`, 'from command', `"${this.id}"`);
        const spinner = this.createSpinner(`Start building...`).start();
        const tsconifgFile = path_1.join(process.cwd(), 'tsconfig.json');
        const outDir = fbi_1.utils.isModuleAvailable(tsconifgFile)
            ? require(tsconifgFile).compilerOptions.outDir
            : 'lib';
        await this.fs.remove(path_1.join(process.cwd(), outDir));
        const execOpts = {
            ...this.factory.execOpts,
            stdio: flags.debug ? 'inherit' : 'pipe'
        };
        await this.exec.command('prisma2 generate', execOpts);
        await this.exec.command('tsc', execOpts);
        spinner.succeed('build successfully');
    }
}
exports.default = CommandBuild;
