import { RubricGenerator } from './RubricGenerator'; // Adjust path if needed
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from the .env file

async function testRubricGenerator() {
    // Fetch OpenAI API key from environment variables
    const apiKey = process.env.OPEN_AI_KEY;
    if (!apiKey) {
        console.error('OpenAI API key is missing!');
        return;
    }

    // Instantiate the RubricGenerator with the API key
    const rubricGenerator = new RubricGenerator(apiKey);

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
        const generatedRubric = await rubricGenerator.createRubric(overview, criteria, keywords, unitOutcomes);

        // Log the result (you can use JSON.stringify for better formatting)
        console.log('Generated Rubric:', JSON.stringify(generatedRubric, null, 2));
    } catch (error) {
        console.error('Error generating rubric:', error);
    }
}

// Run the test function
testRubricGenerator();
