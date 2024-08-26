import { PDFReader } from './PDFReader';
import { OpenAIHandler } from './OpenAIHandler';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function main() {
  const pdfReader = new PDFReader();
  const openAIHandler = new OpenAIHandler(process.env.OPENAI_API_KEY || '');

  const filePath = 'PDFfiles/sample.pdf'; // Replace with your actual PDF file path

  try {
    // Step 1: Read the PDF file
    const pdfContent = await pdfReader.readPDF(filePath);
    console.log('PDF Content:', pdfContent);

    // Step 2: Generate questions and answers based on the PDF content
    const generatedText = await openAIHandler.generateQuestionsAndAnswers(pdfContent);
    console.log('Generated Questions and Answers:', generatedText);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
