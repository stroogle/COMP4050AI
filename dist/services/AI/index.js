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
Object.defineProperty(exports, "__esModule", { value: true });
const AIService_1 = require("../AIService");
function generateQuestions() {
    return __awaiter(this, void 0, void 0, function* () {
        const aiService = new AIService_1.AIService(process.env.OPENAI_API_KEY || '');
        const questionCount = 5; // Number of questions to generate
        const fileContent = 'This is the content of the PDF file'; // Replace with actual PDF content
        try {
            const answer = yield aiService.getQuestions(questionCount, fileContent).catch(() => false);
            if (answer) {
                console.log('Generated Questions:', answer);
            }
            else {
                console.error('Failed to generate questions');
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}
generateQuestions();
//# sourceMappingURL=index.js.map