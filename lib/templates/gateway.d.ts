import Factory from '..';
import BaseClass from './base';
export default class TemplateGateway extends BaseClass {
    factory: Factory;
    id: string;
    path: string;
    description: string;
    templates: never[];
    features: {
        name: string;
        value: boolean;
    }[];
    constructor(factory: Factory);
    protected gathering(flags: Record<string, any>): Promise<void>;
}
