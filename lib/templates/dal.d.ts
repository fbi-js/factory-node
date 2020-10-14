import * as ejs from 'ejs';
import { Template } from 'fbi';
import Factory from '..';
export default class TemplateDal extends Template {
    factory: Factory;
    id: string;
    description: string;
    path: string;
    renderer: typeof ejs.render;
    templates: never[];
    constructor(factory: Factory);
    protected gathering(): Promise<void>;
    protected writing(): Promise<void>;
    protected installing(flags: Record<string, any>): Promise<void>;
    protected ending(): Promise<void>;
}
