import { Factory } from 'fbi';
import CommandBuild from './commands/build';
import CommandServe from './commands/serve';
import CommandDb from './commands/db';
import CommandGenerate from './commands/generate';
import TemplateApp from './templates/app';
import TemplateService from './templates/service';
import TemplateGateway from './templates/gateway';
export default class FactoryNode extends Factory {
    id: string;
    description: string;
    commands: (CommandServe | CommandDb | CommandGenerate | CommandBuild)[];
    templates: (TemplateService | TemplateApp | TemplateGateway)[];
    execOpts: any;
}
