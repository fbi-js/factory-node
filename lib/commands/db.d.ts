import { Command } from 'fbi';
import Factory from '..';
export default class CommandDb extends Command {
    factory: Factory;
    id: string;
    alias: string;
    args: string;
    flags: string[][];
    description: string;
    constructor(factory: Factory);
    run(args: any, flags: any): Promise<void>;
}
