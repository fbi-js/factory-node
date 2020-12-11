"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fbi_1 = require("fbi");
const serve_1 = __importDefault(require("./commands/serve"));
const app_1 = __importDefault(require("./templates/app"));
const service_1 = __importDefault(require("./templates/service"));
const gateway_1 = __importDefault(require("./templates/gateway"));
class FactoryNode extends fbi_1.Factory {
    constructor() {
        super(...arguments);
        this.id = 'factory-node';
        this.description = 'factory for node.js application development';
        this.commands = [new serve_1.default(this)];
        this.templates = [new app_1.default(this), new service_1.default(this), new gateway_1.default(this)];
        this.execOpts = {
            cwd: process.cwd(),
            localDir: path_1.join(__dirname, '../'),
            preferLocal: true
        };
    }
}
exports.default = FactoryNode;
