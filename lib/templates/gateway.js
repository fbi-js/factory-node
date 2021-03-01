"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const base_1 = __importDefault(require("./base"));
class TemplateGateway extends base_1.default {
    constructor(factory) {
        super(factory);
        this.factory = factory;
        this.id = 'gateway';
        this.path = path_1.join(__dirname, '../../templates/gateway');
        this.description = 'template for API gateway';
        this.templates = [];
        this.features = [{ name: 'typescript', value: true }];
    }
    async gathering(flags) {
        await super.gathering(flags);
        const { factory, project } = this.data;
        this.spinner = this.createSpinner(`Creating project...`).start(`Creating ${this.style.bold.green(project.name)} via ${factory.id} from ${factory.template}...`);
    }
}
exports.default = TemplateGateway;
//# sourceMappingURL=gateway.js.map