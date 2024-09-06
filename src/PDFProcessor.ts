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
    try {
      // Ensure the file exists
      if (!fs.existsSync(pdfPath)) {
        throw new Error(`PDF file not found: ${pdfPath}`);
      }

      // Read the PDF content
      const dataBuffer = fs.readFileSync(pdfPath);
      const pdfData = await pdfParse(dataBuffer);
      const pdfText = pdfData.text;

      // Load previously generated questions and answers
      const previousQuestionsAndAnswers = this.loadPreviousQuestionsAndAnswers(pdfPath);

      // Pass previous questions and answers to the prompt manager
      this.promptManager.setPreviousQuestionsAndAnswers(previousQuestionsAndAnswers);

      // Generate new questions and answers
      const newQuestionsAndAnswers = await this.generateQuestionsAndAnswers(pdfText);

      // Validate new questions with OpenAI
      const validatedQA = await this.validateQuestionsWithOpenAI(newQuestionsAndAnswers, previousQuestionsAndAnswers);

      // Check if any valid, unique questions remain
      if (validatedQA.length > 0) {
        // Append or update the result file with the validated content
        this.appendToResults(pdfPath, validatedQA);
      } else {
        console.log("No new unique questions confirmed by OpenAI.");
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
    }
  }

  private loadPreviousQuestionsAndAnswers(pdfPath: string): { question: string; answer: string }[] {
    const resultsFilePath = this.getResultsFilePath(pdfPath);
    const previousQA: { question: string; answer: string }[] = [];

    if (fs.existsSync(resultsFilePath)) {
      const fileContent = fs.readFileSync(resultsFilePath, 'utf-8');
      const jsonContent = JSON.parse(fileContent);

      if (jsonContent.content) {
        previousQA.push(...jsonContent.content);
      }
    }

    return previousQA;
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

  private async validateQuestionsWithOpenAI(
    newQA: { question: string; answer: string }[],
    previousQA: { question: string; answer: string }[]
  ): Promise<{ question: string; answer: string }[]> {
    const validatedQA: { question: string; answer: string }[] = [];

    for (const newItem of newQA) {
      const validationPrompt = `
        Here are some previously generated questions and answers:
        ${previousQA.map(qa => `- ${qa.question} - ${qa.answer}`).join("\n")}

        Is the following question similar to any of the previous ones? If it's not similar, say "Unique", otherwise say "Similar":

        Question: ${newItem.question}
        Answer: ${newItem.answer}
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini-2024-07-18',
        messages: [
          {
            role: 'user',
            content: validationPrompt,
          },
        ],
      });

      const validationMessage = response.choices[0].message?.content || '';

      if (validationMessage.trim().toLowerCase().includes("unique")) {
        validatedQA.push(newItem);
      }
    }

    return validatedQA;
  }

  private appendToResults(pdfPath: string, newQuestionsAndAnswers: { question: string; answer: string }[]): void {
    const resultsFilePath = this.getResultsFilePath(pdfPath);
    let existingContent: { content: { question: string; answer: string }[] } = { content: [] };

    // If the file exists, load the existing content
    if (fs.existsSync(resultsFilePath)) {
      const fileContent = fs.readFileSync(resultsFilePath, 'utf-8');
      existingContent = JSON.parse(fileContent);
    }

    // Append new questions and answers to the existing content
    existingContent.content.push(...newQuestionsAndAnswers);

    // Write the updated content back to the same file
    fs.writeFileSync(resultsFilePath, JSON.stringify(existingContent, null, 2));
    console.log(`Results updated and saved to ${resultsFilePath}`);
  }

  private getResultsFilePath(pdfPath: string): string {
    const pdfDir = path.dirname(pdfPath);
    const parentDir = path.resolve(pdfDir, '..');
    const resultsDir = path.join(parentDir, 'results');

    // Ensure the results directory exists
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir);
    }

    const pdfBaseName = path.basename(pdfPath, path.extname(pdfPath));
    return path.join(resultsDir, `${pdfBaseName}.json`);
  }
}
