import Factory from '..';
import BaseClass from './base';
export default class TemplateService extends BaseClass {
    factory: Factory;
    id: string;
    path: string;
    description: string;
    templates: never[];
    choices: {
        name: string;
        value: string;
        hint: string;
        children: {
            name: string;
            value: boolean;
            hint: string;
        }[];
    }[];
    constructor(factory: Factory);
    protected gathering(flags: Record<string, any>): Promise<void>;
    protected writing(): Promise<void>;
}
