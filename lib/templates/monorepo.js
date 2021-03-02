"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const base_1 = __importDefault(require("./base"));
class TemplateMonorepo extends base_1.default {
    constructor(factory) {
        super(factory);
        this.factory = factory;
        this.id = 'monorepo';
        this.path = path_1.join(__dirname, '../../templates/monorepo');
        this.description = 'TypeScript monorepo with lerna and yarn workspace';
        this.templates = [];
        this.features = [];
    }
    async gathering(flags) {
        await super.gathering(flags);
    }
}
exports.default = TemplateMonorepo;
//# sourceMappingURL=monorepo.js.map