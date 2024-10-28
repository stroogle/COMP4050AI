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
const FeedbackGenerator_1 = require("./FeedbackGenerator");
const openai_1 = require("openai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables from the .env file
// Example rubric for testing purposes
const rubric = [
    {
        name: "Algorithm Understanding",
        gradeDescriptors: {
            Fail: "Fails to demonstrate understanding of basic algorithmic concepts.",
            Pass: "Shows basic understanding of algorithmic concepts but cannot apply them effectively.",
            Credit: "Shows a good understanding of algorithmic concepts with minor mistakes in application.",
            Distinction: "Displays a strong grasp of algorithmic concepts and can apply them correctly in various scenarios.",
            HighDistinction: "Exhibits deep understanding of algorithmic concepts and can optimize them for efficiency and scalability."
        }
    },
    {
        name: "Data Structures",
        gradeDescriptors: {
            Fail: "Fails to apply basic data structures effectively.",
            Pass: "Applies basic data structures with some errors.",
            Credit: "Shows proficiency in using data structures like arrays, linked lists, and trees.",
            Distinction: "Demonstrates advanced understanding of data structures and applies them correctly in complex scenarios.",
            HighDistinction: "Expertly applies advanced data structures, optimizing for performance and efficiency."
        }
    }
];
// Test function to simulate generating feedback using FeedbackGenerator
function testFeedbackGenerator() {
    return __awaiter(this, void 0, void 0, function* () {
        // Fetch OpenAI API key from environment variables
        const apiKey = process.env.OPEN_AI_KEY;
        if (!apiKey) {
            console.error('OpenAI API key is missing!');
            return;
        }
        // Instantiate the OpenAI client and FeedbackGenerator
        const openai = new openai_1.OpenAI({ apiKey });
        const feedbackGenerator = new FeedbackGenerator_1.FeedbackGenerator(openai);
        // Path to the PDF file you want to generate feedback for
        const pdfPath = './PDFfiles/sample.pdf';
        try {
            // Generate feedback using the PDF content and rubric
            const feedback = yield feedbackGenerator.generateFeedback(pdfPath, rubric);
            // Log the generated feedback to the console
            console.log('Generated Feedback:', feedback);
        }
        catch (error) {
            console.error('Error generating feedback:', error);
        }
    });
}
// Run the test function
testFeedbackGenerator();
//# sourceMappingURL=testFeedbackGenerator.js.map