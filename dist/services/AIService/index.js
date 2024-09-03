"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
// src/services/AIService/index.ts
const openai_1 = __importDefault(require("openai"));
class AIService {
    constructor(apiKey) {
        this.openai = new openai_1.default({
            apiKey: apiKey,
        });
    }
    getQuestions(questionCount, content) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const response = yield this.openai.chat.completions.create({
                    model: 'gpt-4o-mini-2024-07-18', // Specify the model
                    messages: [
                        { role: 'system', content: `Please generate ${questionCount} short and two openended questions with answers based on the following content.A` },
                        { role: 'user', content: content }
                    ],
                });
                if (response.choices && response.choices.length > 0) {
                    return ((_a = response.choices[0].message) === null || _a === void 0 ? void 0 : _a.content) || 'No content generated';
                }
                else {
                    return 'No valid response from OpenAI';
                }
            }
            catch (error) {
                const err = error; // Ensure proper error handling
                throw new Error(`Error calling OpenAI API: ${err.message}`);
            }
        });
    }
}
exports.AIService = AIService;
//# sourceMappingURL=index.js.map