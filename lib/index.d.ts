import { Factory } from 'fbi';
import CommandServe from './commands/serve';
import TemplateBase from './templates/base';
import TemplateApp from './templates/app';
import TemplateService from './templates/service';
import TemplateGateway from './templates/gateway';
export default class FactoryNode extends Factory {
    id: any;
    description: any;
    commands: CommandServe[];
    templates: (TemplateApp | TemplateService | TemplateGateway)[];
    execOpts: {
        cwd: string;
        localDir: string;
        preferLocal: boolean;
    };
}
export { CommandServe, TemplateBase, TemplateApp, TemplateService, TemplateGateway };
