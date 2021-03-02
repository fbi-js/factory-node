import Factory from '..';
import BaseClass from './base';
export default class TemplateMonorepo extends BaseClass {
    factory: Factory;
    id: string;
    path: string;
    description: string;
    templates: never[];
    features: never[];
    constructor(factory: Factory);
    protected gathering(flags: Record<string, any>): Promise<void>;
}
