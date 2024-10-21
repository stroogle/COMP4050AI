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
exports.RubricGenerator = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Ensure environment variables are loaded
class RubricGenerator {
    constructor(apiKey) {
        this.openai = new openai_1.default({ apiKey });
    }
    /**
     * This function sends the content to OpenAI and asks it to generate a rubric with criteria and grade descriptors.
     * The rubric is returned as a structured JSON object.
     * @param content - The content from which the rubric is generated.
     * @returns A JSON object representing the rubric.
     */
    generateRubricFromContent(content) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const prompt = `
            Please analyze the following content and generate a detailed marking rubric.
            The rubric should include the following:
            - Multiple clear criteria for evaluation from the content (two word criteria name at max)
            - Grade descriptors for each criterion (e.g., Fail, Pass, Credit, Distinction, High Distinction)
            - Each grade descriptor should be elaborate, providing clear distinctions between the levels on what to expect form the content provied for analysis .
        
            
            Return the rubric as a structured JSON object without any additional formatting or Markdown.
            
            Content to analyze:
            ${content}
        `;
            try {
                const response = yield this.openai.chat.completions.create({
                    model: "gpt-4o-2024-08-06",
                    messages: [{ role: 'user', content: prompt }],
                });
                // Log the full API response for debugging purposes
                // console.log('Raw API Response:', JSON.stringify(response, null, 2));
                let generatedRubric = ((_c = (_b = (_a = response.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) || null;
                if (!generatedRubric) {
                    throw new Error('Failed to generate rubric.');
                }
                // Strip out the backticks and parse the JSON
                generatedRubric = generatedRubric.replace(/```json|```/g, '').trim();
                // Parse the cleaned-up JSON
                return JSON.parse(generatedRubric);
            }
            catch (error) {
                console.error('Error generating rubric:', error);
                throw new Error('Failed to generate rubric.');
            }
        });
    }
}
exports.RubricGenerator = RubricGenerator;
//# sourceMappingURL=RubricGenerator.js.map