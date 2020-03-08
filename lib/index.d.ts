import { Factory } from 'fbi';
import CommandBuild from './commands/build';
import CommandServe from './commands/serve';
import CommandDb from './commands/db';
import CommandGenerate from './commands/generate';
import TemplateGraphql from './templates/graphql';
export default class FactoryNode extends Factory {
    id: string;
    version: any;
    description: string;
    commands: (CommandBuild | CommandServe | CommandDb | CommandGenerate)[];
    templates: TemplateGraphql[];
    execOpts: any;
}
