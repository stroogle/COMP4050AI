import { PDFProcessor } from './PDFProcessor';
import { PromptManager } from './PromptManager';
import { RubricGenerator } from './RubricGenerator';
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

  // Define custom rubrics directly in main
  const customRubrics = [
    { category: "Clarity", description: "Evaluate the clarity of the content." },
    { category: "Completeness", description: "Evaluate how complete the response is." },
    { category: "Accuracy", description: "Evaluate the accuracy of the provided information." },
    { category: "Engagement", description: "Evaluate how engaging the content is." }, // Example additional rubric
  ];

  // Set the number of criteria and format for the rubric
  const numberOfCriteria = customRubrics.length; // Set this based on the number of custom rubrics
  const criteriaFormat = "Criteria: [Provide the format for the criteria]";

  // Create an instance of RubricGenerator with the custom rubrics
  const rubricGenerator = new RubricGenerator(numberOfCriteria, criteriaFormat, customRubrics);

  // Create an instance of PDFProcessor, passing the OpenAI API key, PromptManager, RubricGenerator, and the model
  const pdfProcessor = new PDFProcessor(process.env.OPENAI_API_KEY || '', promptManager, rubricGenerator, openAIModel);

  // Process the PDF, and specify the temp directory for saving the results
  const result = await pdfProcessor.processPDF(pdfPath, tempDir, false);

  // Output the new questions and answers to the console
  if (result.questions) {
    console.log('New Questions and Answers:');
    console.log(JSON.stringify(result.questions, null, 2));
  } else {
    console.log('No new questions were generated.');
  }

  // Output the rubric evaluation to the console
  if (result.rubric) {
    console.log('Rubric Evaluation:');
    console.log(result.rubric);
  } else {
    console.log('No rubric evaluation was generated.');
  }
}

main();
