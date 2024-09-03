"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiFactory = void 0;
const MockSarapeAi_1 = require("./MockSarapeAi");
const SarapeAi_1 = require("./SarapeAi");
const fs_1 = __importDefault(require("fs"));
class AiFactory {
    static makeAi(pdf_dir, question_dir, api_key) {
        if (!fs_1.default.existsSync(pdf_dir)) {
            fs_1.default.mkdirSync(pdf_dir);
        }
        if (!fs_1.default.existsSync(question_dir)) {
            fs_1.default.mkdirSync(question_dir);
        }
        if (process.env.IS_MOCK == "YES")
            return new MockSarapeAi_1.MockSarapeAi(pdf_dir, question_dir, api_key);
        return new SarapeAi_1.SarapeAi(pdf_dir, question_dir, api_key);
    }
}
exports.AiFactory = AiFactory;
//# sourceMappingURL=AiFactory.js.map