import { FeedbackGenerator } from './FeedbackGenerator';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from the .env file

// Define the Rubric type
type Rubric = {
    name: string;
    gradeDescriptors: {
        Fail: string;
        Pass: string;
        Credit: string;
        Distinction: string;
        HighDistinction: string;
    };
};

// Example rubric for testing purposes
const rubric: Rubric[] = [
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
async function testFeedbackGenerator() {
    // Fetch OpenAI API key from environment variables
    const apiKey = process.env.OPEN_AI_KEY;
    if (!apiKey) {
        console.error('OpenAI API key is missing!');
        return;
    }

    // Instantiate the OpenAI client and FeedbackGenerator
    const openai = new OpenAI({ apiKey });
    const feedbackGenerator = new FeedbackGenerator(openai);

    // Path to the PDF file you want to generate feedback for
    const pdfPath = './PDFfiles/sample.pdf';

    try {
        // Generate feedback using the PDF content and rubric
        const feedback = await feedbackGenerator.generateFeedback(pdfPath, rubric);

        // Log the generated feedback to the console
        console.log('Generated Feedback:', feedback);
    } catch (error) {
        console.error('Error generating feedback:', error);
    }
}

// Run the test function
testFeedbackGenerator();
