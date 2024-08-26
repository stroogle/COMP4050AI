import { PDFReader } from './PDFReader';
import { OpenAIHandler } from './OpenAIHandler';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

async function main() {
  const pdfReader = new PDFReader();
  const openAIHandler = new OpenAIHandler(process.env.OPENAI_API_KEY || '');

  const filePath = 'PDFfiles/sample.pdf'; // Replace with your actual PDF file path

  if (!fs.existsSync(filePath)) {
    console.error('File does not exist:', filePath);
    return;
  }

  try {
    // Step 1: Read the PDF file
    const pdfContent = await pdfReader.readPDF(filePath);
    console.log('PDF Content:', pdfContent);

    // Step 2: Generate questions and answers based on the PDF content
    const generatedText = await openAIHandler.generateQuestionsAndAnswers(pdfContent);
    console.log('Generated Questions and Answers:', generatedText);

    // Step 3: Determine the next file number
    const resultDir = './results';
    if (!fs.existsSync(resultDir)) {
      fs.mkdirSync(resultDir);
    }
    
    // Filter the result files to find the next number
    const files = fs.readdirSync(resultDir);
    const resultNumber = files.filter(file => file.startsWith('result_')).length + 1;
    const resultFilePath = path.join(resultDir, `result_${resultNumber}.txt`);

    // Step 4: Write the generated text to the new file
    fs.writeFileSync(resultFilePath, generatedText, 'utf8');
    console.log(`Output written to ${resultFilePath}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
