import { Factory } from 'fbi';
import CommandBuild from './commands/build';
import CommandServe from './commands/serve';
import CommandDb from './commands/db';
import CommandGenerate from './commands/generate';
import TemplateDal from './templates/dal';
import TemplateApi from './templates/api';
export default class FactoryNode extends Factory {
    id: string;
    description: string;
    commands: (CommandServe | CommandDb | CommandGenerate | CommandBuild)[];
    templates: (TemplateDal | TemplateApi)[];
    execOpts: any;
}
