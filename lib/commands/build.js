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
        this.description = 'command build description';
        this.args = '';
        this.flags = [
            ['-m, --mode <mode>', 'specify env mode(development|production|testing)', 'production'],
            ['-d, --dev-dependencies', 'with devDependencies', false]
        ];
    }
    async run(flags, unknown) {
        var _a, _b;
        process.env.NODE_ENV = (_a = flags.mode) !== null && _a !== void 0 ? _a : 'production';
        this.debug(`Factory: (${this.factory.id})`, 'from command', `"${this.id}"`, 'flags:', flags, 'unknown:', unknown);
        const _cwd = process.cwd();
        const features = this.context.get('config.factory.features');
        const tsconfigPath = path_1.join(_cwd, 'tsconfig.json');
        const hasTsconfigFile = await this.fs.pathExists(tsconfigPath);
        const tsconifg = hasTsconfigFile ? require(tsconfigPath) : null;
        const distDirName = ((_b = tsconifg === null || tsconifg === void 0 ? void 0 : tsconifg.compilerOptions) === null || _b === void 0 ? void 0 : _b.outDir) || 'dist';
        const distDir = path_1.join(_cwd, distDirName);
        // const srcDir = join(_cwd, tsconifg.compilerOptions.rootDir||'src')
        this.logStart(`Start building:`);
        this.logItem(`remove '${distDirName}'...`);
        await this.fs.remove(distDir);
        const execOpts = {
            ...this.factory.execOpts,
            stdio: flags.debug ? 'inherit' : 'pipe'
        };
        this.logItem('generate prisma client files...');
        await this.exec.command('prisma2 generate', execOpts);
        this.logItem('compile ts files...');
        await this.exec.command('tsc', execOpts);
        if (flags.devDependencies) {
            const pkg = require(path_1.join(_cwd, 'package.json'));
            const ver = this.factory.version ? `#${this.factory.version}` : '';
            pkg['devDependencies'] = fbi_1.utils.merge(pkg['devDependencies'], {
                [this.factory.id]: `github:fbi-js/${this.factory.id}${ver}`,
                fbi: '^4.0.0-alpha.1'
            });
            this.logItem('generate package.json...');
            await this.fs.writeFile(path_1.join(distDir, 'package.json'), JSON.stringify(pkg, null, 2));
            this.logItem('copy .fbi.config.js...');
            await this.fs.copy(path_1.join(_cwd, '.fbi.config.js'), path_1.join(distDir, '.fbi.config.js'));
            if (features === null || features === void 0 ? void 0 : features.prisma) {
                this.logItem('copy prisma folder...');
                await this.fs.copy(path_1.join(_cwd, 'prisma'), path_1.join(distDir, 'prisma'));
            }
        }
        this.logEnd('Build successfully');
    }
}
exports.default = CommandBuild;
