import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import axios from 'axios'; // Using Axios for API requests
import { PromptManager } from './PromptManager';

export class PDFProcessor {
  private apiKey: string;
  private promptManager: PromptManager;
  private model: string;

  constructor(apiKey: string, promptManager: PromptManager, model: string) {
    this.apiKey = apiKey;
    this.promptManager = promptManager;
    this.model = model; // Store the OpenAI model name
  }

  // Modify processPDF to return the new questions and answers
  async processPDF(pdfPath: string, tempDir: string, regenerate: boolean = false): Promise<{ question: string; answer: string }[] | null> {
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
      const previousQuestionsAndAnswers = this.loadPreviousQuestionsAndAnswers(pdfPath, tempDir);

      // Pass previous questions and answers to the prompt manager
      this.promptManager.setPreviousQuestionsAndAnswers(previousQuestionsAndAnswers);

      // Generate new questions and answers
      const newQuestionsAndAnswers = await this.generateQuestionsAndAnswers(pdfText);

      // Validate new questions with OpenAI
      const validatedQA = await this.validateQuestionsWithOpenAI(newQuestionsAndAnswers, previousQuestionsAndAnswers);

      // Check if any valid, unique questions remain
      if (validatedQA.length > 0) {
        // Append or update the result file with the validated content
        this.appendToTemp(pdfPath, tempDir, validatedQA);

        // Return the newly generated questions and answers
        return validatedQA;
      } else {
        console.log("No new unique questions confirmed by OpenAI.");
        return null;
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      return null;
    }
  }

  private loadPreviousQuestionsAndAnswers(pdfPath: string, tempDir: string): { question: string; answer: string }[] {
    const tempFilePath = this.getTempFilePath(pdfPath, tempDir);
    const previousQA: { question: string; answer: string }[] = [];

    if (fs.existsSync(tempFilePath)) {
      const fileContent = fs.readFileSync(tempFilePath, 'utf-8');
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

      // Using Axios to call OpenAI's API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.model, // Use the model set in the constructor
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.choices && response.data.choices.length > 0) {
        const generatedText = response.data.choices[0].message?.content || '';
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

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.model, // Same model for validation
          messages: [
            {
              role: 'user',
              content: validationPrompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const validationMessage = response.data.choices[0].message?.content || '';

      if (validationMessage.trim().toLowerCase().includes("unique")) {
        validatedQA.push(newItem);
      }
    }

    return validatedQA;
  }

  private appendToTemp(pdfPath: string, tempDir: string, newQuestionsAndAnswers: { question: string; answer: string }[]): void {
    const tempFilePath = this.getTempFilePath(pdfPath, tempDir);
    let existingContent: { content: { question: string; answer: string }[] } = { content: [] };

    // If the file exists, load the existing content
    if (fs.existsSync(tempFilePath)) {
      const fileContent = fs.readFileSync(tempFilePath, 'utf-8');
      existingContent = JSON.parse(fileContent);
    }

    // Append new questions and answers to the existing content
    existingContent.content.push(...newQuestionsAndAnswers);

    // Write the updated content back to the same file
    fs.writeFileSync(tempFilePath, JSON.stringify(existingContent, null, 2));
    console.log(`Temp updated and saved to ${tempFilePath}`);
  }

  private getTempFilePath(pdfPath: string, tempDir: string): string {
    // Ensure the temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const pdfBaseName = path.basename(pdfPath, path.extname(pdfPath));
    return path.join(tempDir, `${pdfBaseName}.json`);
  }
}
