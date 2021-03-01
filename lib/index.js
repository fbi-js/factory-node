"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateGateway = exports.TemplateService = exports.TemplateApp = exports.TemplateBase = exports.CommandServe = void 0;
const path_1 = require("path");
const fbi_1 = require("fbi");
const serve_1 = __importDefault(require("./commands/serve"));
exports.CommandServe = serve_1.default;
const base_1 = __importDefault(require("./templates/base"));
exports.TemplateBase = base_1.default;
const app_1 = __importDefault(require("./templates/app"));
exports.TemplateApp = app_1.default;
const service_1 = __importDefault(require("./templates/service"));
exports.TemplateService = service_1.default;
const gateway_1 = __importDefault(require("./templates/gateway"));
exports.TemplateGateway = gateway_1.default;
const monorepo_1 = __importDefault(require("./templates/monorepo"));
const { name, description } = require('../package.json');
class FactoryNode extends fbi_1.Factory {
    constructor() {
        super(...arguments);
        this.id = name;
        this.description = description;
        this.commands = [new serve_1.default(this)];
        this.templates = [
            new app_1.default(this),
            new service_1.default(this),
            new gateway_1.default(this),
            new monorepo_1.default(this)
        ];
        this.execOpts = {
            cwd: process.cwd(),
            localDir: path_1.join(__dirname, '../'),
            preferLocal: true
        };
    }
}
exports.default = FactoryNode;
//# sourceMappingURL=index.js.map