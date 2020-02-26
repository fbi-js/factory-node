import { Factory } from 'fbi';
import CommandBuild from './commands/build';
import CommandServe from './commands/serve';
import CommandDb from './commands/db';
import CommandGenerate from './commands/generate';
import TemplateGraphql from './templates/graphql';
export default class FactoryNode extends Factory {
    id: string;
    description: string;
    commands: (CommandDb | CommandServe | CommandGenerate | CommandBuild)[];
    templates: TemplateGraphql[];
    execOpts: any;
    get nodeModulesPath(): string;
    get prismaBin(): string;
    get tsnodeBin(): string;
    get tsnodedevBin(): string;
    get cntBin(): string;
    get createTypesBin(): string;
}
