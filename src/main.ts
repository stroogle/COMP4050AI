import { PDFProcessor } from './PDFProcessor';
import { PromptManager } from './PromptManager';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

async function main() {
  // Set the path to your PDF file (replace with the actual file path)
  const pdfPath = './PDFfiles/437598.pdf';
  
  // Set the temp directory (replace with the actual directory path)
  const tempDir = path.resolve(__dirname, '../temp');

  // Set the number of questions, question format, and answer format
  const numberOfQuestions = 5; // You can modify this value as needed
  const questionFormat = "Question: [Provide the format for questions]";
  const answerFormat = "Answer: [Provide the format for answers]";

  // Set the OpenAI model (replace with your desired model)
  const openAIModel = 'gpt-4o-mini-2024-07-18';

  // Create an instance of PromptManager with the number of questions, question format, and answer format
  const promptManager = new PromptManager(numberOfQuestions, questionFormat, answerFormat);

  // Create an instance of PDFProcessor, passing the OpenAI API key, PromptManager, and the model
  const pdfProcessor = new PDFProcessor(process.env.OPENAI_API_KEY || '', promptManager, openAIModel);

  // Process the PDF, and specify the temp directory for saving the results
  const newQuestionsAndAnswers = await pdfProcessor.processPDF(pdfPath, tempDir, false);

  // Output the new questions and answers to the console
  if (newQuestionsAndAnswers) {
    console.log(JSON.stringify(newQuestionsAndAnswers, null, 2));
  } else {
    console.log('No new questions were generated.');
  }
}

main();
