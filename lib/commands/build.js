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
        this.description = 'command build description';
        this.flags = [['-d, --dev-dependencies', 'with devDependencies', false]];
    }
    async run(args, flags) {
        var _a;
        this.debug(`Factory: (${this.factory.id})`, 'from command', `"${this.id}"`);
        const spinner = this.createSpinner(`Start building...`).start();
        const tsconfigPath = path_1.join(process.cwd(), 'tsconfig.json');
        const hasTsconfigFile = await this.fs.pathExists(tsconfigPath);
        const tsconifg = hasTsconfigFile ? require(tsconfigPath) : null;
        const distDir = path_1.join(process.cwd(), ((_a = tsconifg === null || tsconifg === void 0 ? void 0 : tsconifg.compilerOptions) === null || _a === void 0 ? void 0 : _a.outDir) || 'dist');
        // const srcDir = join(process.cwd(), tsconifg.compilerOptions.rootDir||'src')
        await this.fs.remove(distDir);
        const execOpts = {
            ...this.factory.execOpts,
            stdio: flags.debug ? 'inherit' : 'pipe'
        };
        await this.exec.command('prisma2 generate', execOpts);
        await this.exec.command('tsc', execOpts);
        if (flags.devDependencies) {
            const pkg = require(path_1.join(process.cwd(), 'package.json'));
            const ver = this.factory.version ? `#${this.factory.version}` : '';
            pkg['devDependencies'] = fbi_1.utils.merge(pkg['devDependencies'], {
                [this.factory.id]: `github:fbi-js/${this.factory.id}${ver}`,
                fbi: 'next'
            });
            await this.fs.writeFile(path_1.join(distDir, 'package.json'), JSON.stringify(pkg, null, 2));
            await this.fs.copy(path_1.join(process.cwd(), '.fbi.config.js'), path_1.join(distDir, '.fbi.config.js'));
        }
        spinner.succeed('build successfully');
    }
}
exports.default = CommandBuild;
