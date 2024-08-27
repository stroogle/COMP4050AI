// src/services/AIService/index.ts
import OpenAI from 'openai';

export class AIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async getQuestions(questionCount: number, content: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini-2024-07-18', // Specify the model
        messages: [
          { role: 'system', content: `Please generate ${questionCount} short and two openended questions with answers based on the following content.A` },
          { role: 'user', content: content }
        ],
      });

      if (response.choices && response.choices.length > 0) {
        return response.choices[0].message?.content || 'No content generated';
      } else {
        return 'No valid response from OpenAI';
      }
    } catch (error) {
      const err = error as Error; // Ensure proper error handling
      throw new Error(`Error calling OpenAI API: ${err.message}`);
    }
  }
}
