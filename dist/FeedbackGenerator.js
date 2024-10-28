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
exports.FeedbackGenerator = void 0;
const PDFReader_1 = require("./PDFReader"); // Import your existing PDFReader class
class FeedbackGenerator {
    constructor(openai) {
        this.openai = openai;
        this.pdfReader = new PDFReader_1.PDFReader(); // Instantiate PDFReader
    }
    /**
     * Generates feedback based on the provided rubric and content extracted from the PDF.
     * @param pdf_name - The path to the PDF file.
     * @param rubric - An array of rubric criteria and grade descriptors.
     * @returns A Promise that resolves to a feedback string.
     */
    generateFeedback(pdf_name, rubric) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Use the PDFReader to extract the text content from the PDF
                const content = yield this.pdfReader.readPDF(pdf_name);
                // Convert the rubric to a readable string format
                const rubricString = rubric.map(criteria => `
                Criterion: ${criteria.name}
                Fail: ${criteria.gradeDescriptors.Fail}
                Pass: ${criteria.gradeDescriptors.Pass}
                Credit: ${criteria.gradeDescriptors.Credit}
                Distinction: ${criteria.gradeDescriptors.Distinction}
                High Distinction: ${criteria.gradeDescriptors.HighDistinction}
            `).join('\n\n');
                // Create the prompt for OpenAI
                const prompt = `
                Based on the following rubric, provide detailed feedback for the content below:

                Rubric:
                ${rubricString}

                Content:
                ${content}
            `;
                // Call OpenAI to generate the feedback using GPT-4o mini model
                const response = yield this.openai.chat.completions.create({
                    model: 'gpt-4o-mini', // Use GPT-4o Mini model here
                    messages: [{ role: 'user', content: prompt }]
                });
                // Return the generated feedback from the response
                if (response.choices && response.choices.length > 0) {
                    return ((_a = response.choices[0].message) === null || _a === void 0 ? void 0 : _a.content) || '';
                }
                throw new Error('Failed to generate feedback.');
            }
            catch (error) {
                console.error('Error generating feedback:', error);
                throw error;
            }
        });
    }
}
exports.FeedbackGenerator = FeedbackGenerator;
//# sourceMappingURL=FeedbackGenerator.js.map