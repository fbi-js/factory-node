"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fbi_1 = require("fbi");
const build_1 = require("./commands/build");
const serve_1 = require("./commands/serve");
const db_1 = require("./commands/db");
const generate_1 = require("./commands/generate");
const graphql_1 = require("./templates/graphql");
class FactoryNode extends fbi_1.Factory {
    constructor() {
        super(...arguments);
        this.id = 'node';
        this.description = 'factory for node.js application development';
        this.commands = [
            new build_1.default(this),
            new serve_1.default(this),
            new db_1.default(this),
            new generate_1.default(this)
        ];
        this.templates = [new graphql_1.default(this)];
        this.execOpts = {
            cwd: process.cwd(),
            localDir: path_1.join(__dirname, '../'),
            preferLocal: true
        };
    }
    get nodeModulesPath() {
        return path_1.join(__dirname, '../node_modules');
    }
    get prismaBin() {
        // return join(this.nodeModulesPath, '.bin/prisma2')
        return 'prisma2';
    }
    get tsnodeBin() {
        // return join(this.nodeModulesPath, '.bin/ts-node')
        return 'ts-node';
    }
    get tsnodedevBin() {
        // return join(this.nodeModulesPath, '.bin/ts-node-dev')
        return 'ts-node-dev';
    }
    get cntBin() {
        // return join(this.nodeModulesPath, '.bin/cnt')
        return 'cnt';
    }
    get createTypesBin() {
        // return join(this.nodeModulesPath, '.bin/create-types')
        return 'create-types';
    }
}
exports.default = FactoryNode;
