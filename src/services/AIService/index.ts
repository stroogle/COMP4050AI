// src/services/AIService/index.ts
import { OpenAIHandler } from '../../OpenAIHandler';

export class AIService {
  private openAIHandler: OpenAIHandler;

  constructor(apiKey: string) {
    this.openAIHandler = new OpenAIHandler(apiKey);
  }

  async generateQuestionsFromPDFContent(pdfContent: string): Promise<string> {
    return await this.openAIHandler.generateQuestionsAndAnswers(pdfContent);
  }
}
