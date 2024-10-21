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
const RubricGenerator_1 = require("./RubricGenerator"); // Adjust path if needed
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables from the .env file
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
        // Detailed sample content to generate the rubric from
        const sampleContent = `
        
Week 1	Review of algorithms and related concepts
Week 2	Algorithm Correctness and Efficiency
Week 3	Algorithm Design Strategies
Week 4	Sorting
Week 5	Binary Trees
Week 6	Binary Trees (cont.)
5--18 April	
Mid semester break

Week 7l	
Priority Queues, Heaps and Heapsort

Week 8	Programming with Maps and Hashtables
Week 9	Graph Algorithms
Week 10	Graph Algorithms (cont.)
Week 11	Advanced Trees
Week 12	An Introduction to Computability
    `;
        try {
            // Call the rubric generation method
            const generatedRubric = yield rubricGenerator.generateRubricFromContent(sampleContent);
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