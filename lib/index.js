"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = require("path");
const fbi_1 = require("fbi");
const build_1 = tslib_1.__importDefault(require("./commands/build"));
const serve_1 = tslib_1.__importDefault(require("./commands/serve"));
const db_1 = tslib_1.__importDefault(require("./commands/db"));
const generate_1 = tslib_1.__importDefault(require("./commands/generate"));
const admin_1 = tslib_1.__importDefault(require("./templates/admin"));
const index_1 = tslib_1.__importDefault(require("./templates/api/index"));
const dal_basic_1 = tslib_1.__importDefault(require("./templates/dal-basic"));
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
            // new TemplateGraphql(this),
            new admin_1.default(this),
            new index_1.default(this),
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
