import { Factory } from 'fbi';
import CommandServe from './commands/serve';
import TemplateApp from './templates/app';
import TemplateService from './templates/service';
import TemplateGateway from './templates/gateway';
export default class FactoryNode extends Factory {
    id: string;
    description: string;
    commands: CommandServe[];
    templates: (TemplateApp | TemplateService | TemplateGateway)[];
    execOpts: {
        cwd: string;
        localDir: string;
        preferLocal: boolean;
    };
}
