import { PDFProcessor } from './PDFProcessor';
import { PromptManager } from './PromptManager';
import * as dotenv from 'dotenv';
import * as path from 'path'; // Import the path module

// Load environment variables from .env file
dotenv.config();

async function main() {
  const pdfFileName = '437598.pdf';  // Replace with your desired file name
  const baseDir = 'PDFfiles'; // Replace with the base directory of your PDF files
  const pdfPath = path.resolve(baseDir, pdfFileName); // Use path.resolve to get the full path to the PDF file
  const numberOfQuestions = 5; // Define how many questions to generate
  const questionFormat = "Question: [Your question here]"; // Define the format for questions
  const answerFormat = "Answer: [Your answer here]"; // Define the format for answers
  const apiKey = process.env.OPENAI_API_KEY || '';

  if (!apiKey) {
    console.error('OpenAI API key is not set. Please add it to your .env file.');
    return;
  }

  const promptManager = new PromptManager(numberOfQuestions, questionFormat, answerFormat);
  const processor = new PDFProcessor(apiKey, promptManager);

  try {
    await processor.processPDF(pdfPath); // Pass the dynamically constructed path
    console.log('PDF processed successfully.');
  } catch (error) {
    console.error('Error processing PDF:', error);
  }
}

main();
