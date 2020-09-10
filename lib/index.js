"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fbi_1 = require("fbi");
const build_1 = require("./commands/build");
const serve_1 = require("./commands/serve");
const db_1 = require("./commands/db");
const generate_1 = require("./commands/generate");
const graphql_1 = require("./templates/graphql");
const admin_1 = require("./templates/admin");
const api_basic_1 = require("./templates/api-basic");
const api_combine_1 = require("./templates/api-combine");
const dal_basic_1 = require("./templates/dal-basic");
class FactoryNode extends fbi_1.Factory {
    constructor() {
        super(...arguments);
        this.id = 'factory-node';
        this.description = 'factory for node.js application development';
        this.commands = [
            new build_1.default(this),
            new serve_1.default(this),
            new db_1.default(this),
            new generate_1.default(this)
        ];
        this.templates = [
            new graphql_1.default(this),
            new admin_1.default(this),
            new api_basic_1.default(this),
            new api_combine_1.default(this),
            new dal_basic_1.default(this)
        ];
        this.execOpts = {
            cwd: process.cwd(),
            localDir: path_1.join(__dirname, '../'),
            preferLocal: true
        };
    }
}
exports.default = FactoryNode;
