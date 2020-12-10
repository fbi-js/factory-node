"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("./base"));
class TemplateService extends base_1.default {
    constructor(factory) {
        super(factory);
        this.factory = factory;
        this.id = 'service';
        this.path = 'templates/service';
        this.description = 'template for API service';
        this.templates = [];
        this.features = [
            { name: 'graphql', value: true },
            { name: 'openapi', value: true },
            { name: 'prisma', value: true },
            { name: 'multiple', value: true },
            { name: 'mesh', value: true }
        ];
    }
    async gathering(flags) {
        await super.gathering(flags);
        const { factory, project } = this.data;
        this.spinner = this.createSpinner(`Creating project...`).start(`Creating ${this.style.bold.green(project.name)} via ${factory.id} from ${factory.template}...`);
    }
}
exports.default = TemplateService;
