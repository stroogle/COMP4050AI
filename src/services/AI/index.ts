import { AIService } from '../AIService';
export {};

async function generateQuestions() {
  const aiService = new AIService(process.env.OPENAI_API_KEY || '');

  const questionCount = 5; // Number of questions to generate
  const fileContent = 'This is the content of the PDF file'; // Replace with actual PDF content

  try {
    const answer = await aiService.getQuestions(questionCount, fileContent).catch(() => false);
    if (answer) {
      console.log('Generated Questions:', answer);
    } else {
      console.error('Failed to generate questions');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

generateQuestions();
