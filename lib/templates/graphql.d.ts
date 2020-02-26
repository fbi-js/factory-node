import { Template } from 'fbi';
import * as ejs from 'ejs';
import Factory from '..';
export default class TemplateGraphql extends Template {
    factory: Factory;
    id: string;
    description: string;
    path: string;
    renderer: typeof ejs.render;
    constructor(factory: Factory);
    protected prompting(): Promise<void>;
    protected start(): Promise<void>;
    protected writing(): Promise<void>;
    protected install(): Promise<void>;
    protected end(): Promise<void>;
    private _promptDB;
}
