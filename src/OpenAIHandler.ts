import OpenAI from 'openai';

export class OpenAIHandler {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateQuestionsAndAnswers(pdfContent: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18', // Make sure to use the correct model name like 'gpt-4o-mini-2024-07-18'
      messages: [
        { role: 'system', content: 'You read through entire pdf files and create five short questions and two open-ended questions with answers from it. Answers need to be at least 8 minutes long to answer.' },
        { role: 'user', content: `Here is the content of the PDF: ${pdfContent}` }
      ],
      max_tokens: 2048, // Adjust as needed
    });

    if (response.choices && response.choices.length > 0) {
      const message = response.choices[0].message;
      if (message && message.content) {
        return message.content.trim();
      }
    }
    throw new Error('No valid response from OpenAI');
  }
}