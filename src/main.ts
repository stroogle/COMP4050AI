import { PDFProcessor } from './PDFProcessor';
import { PromptManager } from './PromptManager';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function main() {
  const pdfPath = 'PDFfiles/sample.pdf'; // Replace with your PDF file path
  const numberOfQuestions = 5; // Define how many questions to generate
  const questionFormat = "Question: [Your question here]"; // Define the format for questions
  const answerFormat = "Answer: [Your answer here]"; // Define the format for answers
  const apiKey = process.env.OPENAI_API_KEY || '';
  const regenerate = true; // Set to true if you want to regenerate new questions

  if (!apiKey) {
    console.error('OpenAI API key is not set. Please add it to your .env file.');
    return;
  }

  const promptManager = new PromptManager(numberOfQuestions, questionFormat, answerFormat);
  const processor = new PDFProcessor(apiKey, promptManager);

  try {
    await processor.processPDF(pdfPath, regenerate);
    console.log('PDF processed successfully.');
  } catch (error) {
    console.error('Error processing PDF:', error);
  }
}

main();
