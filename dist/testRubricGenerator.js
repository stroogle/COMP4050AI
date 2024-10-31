"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const RubricGenerator_1 = require("./RubricGenerator"); // Adjust path if needed
const dotenv = __importStar(require("dotenv"));
dotenv.config(); // Load environment variables from the .env file
function testRubricGenerator() {
    return __awaiter(this, void 0, void 0, function* () {
        // Fetch OpenAI API key from environment variables
        const apiKey = process.env.OPEN_AI_KEY;
        if (!apiKey) {
            console.error('OpenAI API key is missing!');
            return;
        }
        // Instantiate the RubricGenerator with the API key
        const rubricGenerator = new RubricGenerator_1.RubricGenerator(apiKey);
        // Define the assignment overview, criteria, keywords, and unit outcomes
        const overview = `This course covers a variety of algorithms and data structures, 
                      aiming to teach students how to evaluate, design, and implement efficient algorithms.`;
        const criteria = [
            "Algorithm Understanding",
            "Efficiency Evaluation",
            "Design Strategy",
            "Data Structures",
            "Graph Proficiency",
            "Computability Insight"
        ];
        const keywords = ["Algorithms", "Data Structures", "Graphs", "Efficiency", "Sorting", "Heaps", "Computability"];
        const unitOutcomes = [
            "Understand the role of algorithms in solving computational problems.",
            "Be able to design efficient algorithms for various problems.",
            "Apply data structures in practical programming scenarios."
        ];
        try {
            // Call the createRubric method to generate a rubric based on the provided data
            const generatedRubric = yield rubricGenerator.createRubric(overview, criteria, keywords, unitOutcomes);
            // Log the result (you can use JSON.stringify for better formatting)
            console.log('Generated Rubric:', JSON.stringify(generatedRubric, null, 2));
        }
        catch (error) {
            console.error('Error generating rubric:', error);
        }
    });
}
// Run the test function
testRubricGenerator();
//# sourceMappingURL=testRubricGenerator.js.map