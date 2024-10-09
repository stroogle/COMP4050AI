import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { OpenAI } from 'openai';
import { QuestionAnswerGenerator } from './QuestionAnswerGenerator';
import { RubricGenerator } from './RubricGenerator';
import { FeedbackGenerator } from './FeedbackGenerator';

export class PDFProcessor {
  private openai: OpenAI;
  private questionAnswerGenerator: QuestionAnswerGenerator;
  private rubricGenerator: RubricGenerator;
  private feedbackGenerator: FeedbackGenerator;
  private model: string;

  constructor(apiKey: string, questionAnswerGenerator: QuestionAnswerGenerator, rubricGenerator: RubricGenerator, model: string) {
    this.openai = new OpenAI({ apiKey });
    this.questionAnswerGenerator = questionAnswerGenerator;
    this.rubricGenerator = rubricGenerator;

    // Pass OpenAI instance to FeedbackGenerator
    this.feedbackGenerator = new FeedbackGenerator(this.openai);
    this.model = model;
  }

  // Process PDF and extract content
  async processPDF(pdfPath: string): Promise<string> {
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF file not found: ${pdfPath}`);
    }

    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    const pdfText = pdfData.text;

    if (!pdfText || pdfText.trim() === "") {
      throw new Error("The PDF content is empty or unreadable.");
    }

    console.log('PDF Content:', pdfText);
    return pdfText;
  }

  // Generate Questions and Answers, checking for duplicates and uniqueness
  async generateQuestionsAndAnswers(content: string, tempDir: string, pdfPath: string): Promise<{ question: string; answer: string }[]> {
    const previousQuestionsAndAnswers = this.loadPreviousQuestionsAndAnswers(pdfPath, tempDir);
    this.questionAnswerGenerator.setPreviousQuestionsAndAnswers(previousQuestionsAndAnswers);

    const maxAttempts = 10; // Max attempts to generate unique questions
    let attempts = 0;
    let generatedQuestionsAndAnswers: { question: string; answer: string }[] = [];

    // Generate questions and ensure no duplicates
    while (generatedQuestionsAndAnswers.length < this.questionAnswerGenerator.getNumberOfQuestions() && attempts < maxAttempts) {
      attempts++;
      const prompt = this.questionAnswerGenerator.generateQuestionPrompt(content);

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      if (response.choices && response.choices.length > 0) {
        const generatedText = response.choices[0].message?.content || '';
        const newQuestionsAndAnswers = this.parseQuestionsAndAnswers(generatedText);

        // Validate new questions
        const validatedQuestions = await this.validateQuestionsWithOpenAI(newQuestionsAndAnswers, previousQuestionsAndAnswers);

        if (validatedQuestions.length > 0) {
          generatedQuestionsAndAnswers.push(...validatedQuestions);
        }
      }

      if (attempts >= maxAttempts) {
        throw new Error('No new unique questions could be generated.');
      }
    }

    if (generatedQuestionsAndAnswers.length === 0) {
      throw new Error('No new questions were generated.');
    }

    // Save new unique questions to temp file
    this.appendToTemp(pdfPath, tempDir, generatedQuestionsAndAnswers);
    return generatedQuestionsAndAnswers;
  }

  // Load previously generated questions from the temp file
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

  // Validate new questions with OpenAI to ensure uniqueness
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
        model: this.model,
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

  // Generate Rubric based on the content
  async generateRubric(content: string): Promise<string> {
    const rubric = await this.rubricGenerator.generateRubricFromContent(content);
    
    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: rubric }],
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message?.content || '';
    }

    return '';
  }

  // Generate feedback based on rubric and content
  async generateFeedback(content: string, rubric: string): Promise<string | null> {
    const feedback = await this.feedbackGenerator.generateFeedback(content, rubric);

    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: feedback }],
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message?.content || null;
    }

    return null;
  }

  // Helper function to save validated questions to temp file
  private appendToTemp(pdfPath: string, tempDir: string, newQuestionsAndAnswers: { question: string; answer: string }[]): void {
    const tempFilePath = this.getTempFilePath(pdfPath, tempDir);
    let existingContent: { content: { question: string; answer: string }[] } = { content: [] };

    if (fs.existsSync(tempFilePath)) {
      const fileContent = fs.readFileSync(tempFilePath, 'utf-8');
      existingContent = JSON.parse(fileContent);
    }

    existingContent.content.push(...newQuestionsAndAnswers);

    fs.writeFileSync(tempFilePath, JSON.stringify(existingContent, null, 2));
    console.log(`Temp updated and saved to ${tempFilePath}`);
  }

  private getTempFilePath(pdfPath: string, tempDir: string): string {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const pdfBaseName = path.basename(pdfPath, path.extname(pdfPath));
    return path.join(tempDir, `${pdfBaseName}.json`);
  }

  // Helper function to parse questions and answers, removing numbering
  private parseQuestionsAndAnswers(text: string): { question: string; answer: string }[] {
    const qaPairs: { question: string; answer: string }[] = [];
    const lines = text.split('\n').filter(line => line.trim() !== '');

    for (let i = 0; i < lines.length; i += 2) {
      // Remove numbering (like "1.", "2.") from the question
      const question = lines[i].replace(/^\d+\.\s*/, '').replace('Question:', '').trim();
      const answer = lines[i + 1]?.replace('Answer:', '').trim() || '';
      qaPairs.push({ question, answer });
    }

    return qaPairs;
  }
}
