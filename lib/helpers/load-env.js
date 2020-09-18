"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const fbi_1 = require("fbi");
const dotenv = tslib_1.__importStar(require("dotenv"));
const getDotEnvFiles = (basePath, mode) => [`${path_1.join(basePath, '.env')}`, mode ? `${path_1.join(basePath, `.env.${mode}`)}` : ''].filter(Boolean);
const setupDotEnv = (dotEnvFile, debug, { error }) => {
    try {
        const { parsed } = dotenv.config({
            path: dotEnvFile,
            debug: debug ? true : undefined
        });
        // override
        if (parsed && fbi_1.utils.isValidObject(parsed)) {
            Object.entries(parsed).forEach(([key, val]) => {
                process.env[key] = val;
            });
        }
    }
    catch (err) {
        // only ignore error if file is not found
        if (err.toString().indexOf('ENOENT') < 0) {
            error(err);
        }
    }
};
function loadEnv({ basePath = process.cwd(), mode = '', debug = false }, { fs, error }) {
    getDotEnvFiles(basePath, mode).forEach(dotEnvFile => {
        if (fs.existsSync(dotEnvFile)) {
            setupDotEnv(dotEnvFile, debug, { error });
        }
        if (fs.existsSync(`${dotEnvFile}.local`)) {
            setupDotEnv(`${dotEnvFile}.local`, debug, { error });
        }
    });
}
exports.loadEnv = loadEnv;
