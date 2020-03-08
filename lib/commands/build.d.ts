import { Command } from 'fbi';
import Factory from '..';
export default class CommandBuild extends Command {
    factory: Factory;
    id: string;
    alias: string;
    args: string;
    description: string;
    flags: (string | boolean)[][];
    constructor(factory: Factory);
    run(args: any, flags: any): Promise<void>;
}
