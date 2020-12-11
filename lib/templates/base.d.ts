import Factory from '..';
import * as ejs from 'ejs';
import { Template } from 'fbi';
export default class TemplateNodeBase extends Template {
    factory: Factory;
    id: string;
    renderer: typeof ejs.render;
    features: any[];
    constructor(factory: Factory);
    protected gathering(flags: Record<string, any>): Promise<void>;
    protected writing(): Promise<void>;
    protected installing(flags: Record<string, any>): Promise<void>;
    protected ending(): Promise<void>;
}
