import { RubricGenerator } from './RubricGenerator'; // Adjust path if needed
import dotenv from 'dotenv';

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
        const generatedRubric = await rubricGenerator.generateRubricFromContent(sampleContent);

        // Log the result (you can use JSON.stringify for better formatting)
        console.log('Generated Rubric:', JSON.stringify(generatedRubric, null, 2));
    } catch (error) {
        console.error('Error generating rubric:', error);
    }
}

// Run the test function
testRubricGenerator();
