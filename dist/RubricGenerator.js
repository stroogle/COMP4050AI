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
dotenv_1.default.config();
class RubricGenerator {
    constructor(apiKey) {
        this.openai = new openai_1.default({ apiKey });
    }
    /**
     * Creates a rubric based on the provided overview, criteria, keywords, and unit outcomes.
     * @param overview - An overview or description of the assignment.
     * @param criteria - Specific criteria that should be evaluated in the rubric.
     * @param keywords - Any specific keywords or topics that should be emphasized.
     * @param unit_outcomes - Learning outcomes that the rubric should map to.
     * @returns A promise that resolves to a structured list of rubric criteria with grade descriptors.
     */
    createRubric(overview, criteria, keywords, unit_outcomes) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            // Build the prompt based on the provided input
            let prompt = `Please generate a detailed marking rubric based on the following information. The rubric should include multiple criteria for evaluation and each criterion should have detailed grade descriptors for Fail, Pass, Credit, Distinction, and High Distinction. \n\n`;
            if (overview) {
                prompt += `Assignment Overview: ${overview}\n\n`;
            }
            if (criteria && criteria.length > 0) {
                prompt += `Evaluation Criteria:\n- ${criteria.join("\n- ")}\n\n`;
            }
            if (keywords && keywords.length > 0) {
                prompt += `Relevant Keywords: ${keywords.join(", ")}\n\n`;
            }
            if (unit_outcomes && unit_outcomes.length > 0) {
                prompt += `Unit Learning Outcomes:\n- ${unit_outcomes.join("\n- ")}\n\n`;
            }
            // prompt += `Please structure the output as a JSON array with objects structured like:
            // [
            //     {
            //         "name": "<Criterion Name>",
            //         "gradeDescriptors": {
            //             "fail": "<Detailed description for Fail>",
            //             "pass": "<Detailed description for Pass>",
            //             "credit": "<Detailed description for Credit>",
            //             "distinction": "<Detailed description for Distinction>",
            //             "highDistinction": "<Detailed description for High Distinction>"
            //         }
            //     }
            // ]`;
            prompt += `Please structure the output as a JSON array with objects structured like:
        
        [
            {
                "criteria": "<Criterion Name>",
                "fail": "<Detailed description for Fail>",
                "pass": "<Detailed description for Pass>",
                "credit": "<Detailed description for Credit>",
                "distinction": "<Detailed description for Distinction>",
                "high_distinction": "<Detailed description for High Distinction>"
            }
        ]`;
            try {
                const response = yield this.openai.chat.completions.create({
                    model: "gpt-4o-2024-08-06",
                    messages: [{ role: 'user', content: prompt }],
                });
                let generatedRubric = ((_c = (_b = (_a = response.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) || null;
                if (!generatedRubric) {
                    throw new Error('Failed to generate rubric.');
                }
                // Clean the output and parse the JSON
                generatedRubric = generatedRubric.replace(/```json|```/g, '').trim();
                // Parse the cleaned-up JSON
                // const parsedRubric = JSON.parse(generatedRubric).map((item: any) => ({
                //     name: item.name,
                //     gradeDescriptors: {
                //         fail: item.gradeDescriptors.Fail || item.gradeDescriptors.fail || '',
                //         pass: item.gradeDescriptors.Pass || item.gradeDescriptors.pass || '',
                //         credit: item.gradeDescriptors.Credit || item.gradeDescriptors.credit || '',
                //         distinction: item.gradeDescriptors.Distinction || item.gradeDescriptors.distinction || '',
                //         highDistinction: item.gradeDescriptors.HighDistinction || item.gradeDescriptors.highDistinction || ''
                //     }
                // })) as Rubric[];
                const parsedRubric = JSON.parse(generatedRubric).map((item) => ({
                    criteria: item.criteria,
                    fail: item.gradeDescriptors.Fail || item.gradeDescriptors.fail || '',
                    pass: item.gradeDescriptors.Pass || item.gradeDescriptors.pass || '',
                    credit: item.gradeDescriptors.Credit || item.gradeDescriptors.credit || '',
                    distinction: item.gradeDescriptors.Distinction || item.gradeDescriptors.distinction || '',
                    high_distinction: item.gradeDescriptors.HighDistinction || item.gradeDescriptors.highDistinction || ''
                }));
                return parsedRubric;
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