import { Template } from 'fbi';
import * as ejs from 'ejs';
import Factory from '../..';
import SubTemplateBasic from './api-basic';
import SubTemplateCombine from './api-combine';
export default class TemplateWeb extends Template {
    factory: Factory;
    id: string;
    description: string;
    path: string;
    renderer: typeof ejs.render;
    templates: (SubTemplateBasic | SubTemplateCombine)[];
    projectInfo: Record<string | number, any>;
    constructor(factory: Factory);
    protected gathering(flags: Record<string, any>): Promise<void>;
}
