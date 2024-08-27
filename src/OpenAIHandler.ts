// src/OpenAIHandler.ts
import OpenAI from 'openai';

export class OpenAIHandler {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async generateQuestionsAndAnswers(pdfContent: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a knowledgeable assistant. Please generate questions and answers based on the content provided.' },
          { role: 'user', content: pdfContent }
        ],
      });

      if (response.choices && response.choices.length > 0) {
        return response.choices[0].message?.content || 'No content generated';
      } else {
        return 'No valid response from OpenAI';
      }
    } catch (error) {
      if (error instanceof Error) {
        // Handle error as an instance of Error
        throw new Error(`Error calling OpenAI API: ${error.message}`);
      } else {
        // Handle other types of errors if necessary
        throw new Error('An unknown error occurred');
      }
    }
  }
}
