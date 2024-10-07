import { PDFProcessor } from './PDFProcessor';
import { QuestionAnswerGenerator } from './QuestionAnswerGenerator';
import { RubricGenerator } from './RubricGenerator';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

async function main() {
  const pdfPath = './PDFfiles/437598.pdf';
  const tempDir = path.resolve(__dirname, '../temp');
  const numberOfQuestions = 5;
  const questionFormat = "Question: [Provide the format for questions]";
  const answerFormat = "Answer: [Provide the format for answers]";
  const openAIModel = 'gpt-4o-mini-2024-07-18';

  const questionAnswerGenerator = new QuestionAnswerGenerator(numberOfQuestions, questionFormat, answerFormat);
  const customRubrics = [
    { category: "Clarity", description: "Evaluate the clarity of the content." },
    { category: "Completeness", description: "Evaluate how complete the response is." },
    { category: "Accuracy", description: "Evaluate the accuracy of the provided information." },
    { category: "Engagement", description: "Evaluate how engaging the content is." },
  ];
  const rubricGenerator = new RubricGenerator(customRubrics);

  const pdfProcessor = new PDFProcessor(process.env.OPENAI_API_KEY || '', questionAnswerGenerator, rubricGenerator, openAIModel);

  try {
    const pdfContent = await pdfProcessor.processPDF(pdfPath);

    // Generate Questions and Answers
    try {
      const questionsAndAnswers = await pdfProcessor.generateQuestionsAndAnswers(pdfContent, tempDir, pdfPath);
      console.log('Generated Questions and Answers:', questionsAndAnswers);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error generating new questions:', error.message);
      } else {
        console.error('Unknown error occurred while generating questions.');
      }
    }

    // Generate Rubric
    const rubric = await pdfProcessor.generateRubric(pdfContent);
    console.log('Generated Rubric:', rubric);

    // Generate Feedback
    const feedback = await pdfProcessor.generateFeedback(pdfContent, rubric);
    console.log('Generated Feedback:', feedback);

  } catch (error) {
    if (error instanceof Error) {
      console.error("An error occurred during processing:", error.message);
    } else {
      console.error("Unknown error occurred during processing.");
    }
  }
}

main();
