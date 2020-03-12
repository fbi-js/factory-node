import { Command } from 'fbi';
import Factory from '..';
export default class CommandBuild extends Command {
    factory: Factory;
    id: string;
    alias: string;
    description: string;
    args: string;
    flags: (string | boolean)[][];
    constructor(factory: Factory);
    run(flags: any, unknown: any): Promise<void>;
}
