"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("./base"));
class TemplateApp extends base_1.default {
    constructor(factory) {
        super(factory);
        this.factory = factory;
        this.id = 'app';
        this.path = 'templates/app';
        this.description = 'template for Node.js application';
        this.templates = [];
        this.features = [];
    }
    async gathering(flags) {
        await super.gathering(flags);
        const { factory, project } = this.data;
        this.spinner = this.createSpinner(`Creating project...`).start(`Creating ${this.style.bold.green(project.name)} via ${factory.id} from ${factory.template}...`);
    }
}
exports.default = TemplateApp;
