import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import OpenAI from 'openai';
import { PromptManager } from './PromptManager';

export class PDFProcessor {
  private openai: OpenAI;
  private promptManager: PromptManager;

  constructor(apiKey: string, promptManager: PromptManager) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
    this.promptManager = promptManager;
  }

  async processPDF(pdfPath: string, regenerate: boolean = false): Promise<void> {
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    const pdfText = pdfData.text;

    // Check if a previous result exists
    const previousQuestions = this.loadPreviousQuestions(pdfPath);
    
    // If regenerating or no previous questions exist, generate new questions
    if (!previousQuestions.length || regenerate) {
      this.promptManager.setPreviousQuestions(previousQuestions);
      const questionsAndAnswers = await this.generateQuestionsAndAnswers(pdfText);

      const pdfDir = path.dirname(pdfPath);
      const parentDir = path.resolve(pdfDir, '..');
      const resultsDir = path.join(parentDir, 'results');

      if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir);
      }

      const pdfBaseName = path.basename(pdfPath, path.extname(pdfPath));

      const resultFileName = this.generateUniqueFileName(resultsDir, pdfBaseName);

      const resultFilePath = path.join(resultsDir, resultFileName);
      fs.writeFileSync(resultFilePath, JSON.stringify({ content: questionsAndAnswers }, null, 2));
      console.log(`Results saved to ${resultFilePath}`);
    } else {
      console.log('Previous questions found, regenerating new questions that are not similar.');
      this.promptManager.setPreviousQuestions(previousQuestions);
      const questionsAndAnswers = await this.generateQuestionsAndAnswers(pdfText);
      
      const pdfDir = path.dirname(pdfPath);
      const parentDir = path.resolve(pdfDir, '..');
      const resultsDir = path.join(parentDir, 'results');

      const pdfBaseName = path.basename(pdfPath, path.extname(pdfPath));
      const resultFileName = this.generateUniqueFileName(resultsDir, pdfBaseName);

      const resultFilePath = path.join(resultsDir, resultFileName);
      fs.writeFileSync(resultFilePath, JSON.stringify({ content: questionsAndAnswers }, null, 2));
      console.log(`New questions saved to ${resultFilePath}`);
    }
  }

  private loadPreviousQuestions(pdfPath: string): string[] {
    const pdfDir = path.dirname(pdfPath);
    const parentDir = path.resolve(pdfDir, '..');
    const resultsDir = path.join(parentDir, 'results');
    const pdfBaseName = path.basename(pdfPath, path.extname(pdfPath));

    // Check if any previous results exist
    let counter = 0;
    const previousQuestions: string[] = [];

    while (true) {
      const resultFileName = counter === 0 ? `${pdfBaseName}.json` : `${pdfBaseName}_${counter}.json`;
      const resultFilePath = path.join(resultsDir, resultFileName);

      if (fs.existsSync(resultFilePath)) {
        const fileContent = fs.readFileSync(resultFilePath, 'utf-8');
        const jsonContent = JSON.parse(fileContent);
        if (jsonContent.content) {
          for (const qa of jsonContent.content) {
            previousQuestions.push(qa.question);
          }
        }
        counter += 1;
      } else {
        break;
      }
    }

    return previousQuestions;
  }

  private async generateQuestionsAndAnswers(content: string): Promise<{ question: string; answer: string }[]> {
    try {
      const prompt = this.promptManager.generatePrompt(content);
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini-2024-07-18',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      if (response.choices && response.choices.length > 0) {
        const generatedText = response.choices[0].message?.content || '';
        const qaPairs = this.parseQuestionsAndAnswers(generatedText);
        return qaPairs;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(`Error generating questions and answers: ${error}`);
    }
  }

  private parseQuestionsAndAnswers(text: string): { question: string; answer: string }[] {
    const qaPairs: { question: string; answer: string }[] = [];
    const lines = text.split('\n').filter(line => line.trim() !== '');
    for (let i = 0; i < lines.length; i += 2) {
      const question = lines[i].replace('Question:', '').trim();
      const answer = lines[i + 1]?.replace('Answer:', '').trim() || '';
      qaPairs.push({ question, answer });
    }

    return qaPairs;
  }

  private generateUniqueFileName(dir: string, baseName: string): string {
    let counter = 0;
    let fileName = `${baseName}.json`;

    while (fs.existsSync(path.join(dir, fileName))) {
      counter += 1;
      fileName = `${baseName}_${counter}.json`;
    }

    return fileName;
  }
}
