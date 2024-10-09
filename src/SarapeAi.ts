import fs from 'fs/promises';
import * as path from 'path';
import { AiService, JSONcontent, QuestionAnswer, Rubric } from './AiService';
import OpenAI from 'openai';
import { PDFProcessor } from './PDFProcessor';
import { QuestionAnswerGenerator } from './QuestionAnswerGenerator';
import { RubricGenerator } from './RubricGenerator';

export class SarapeAi implements AiService {
    pdf_dir: string;
    question_dir: string;
    client: OpenAI;
    pdfProcessor: PDFProcessor;

    constructor(pdf_dir: string, question_dir: string, api_key: string) {
        this.pdf_dir = pdf_dir;
        this.question_dir = question_dir;
        this.client = new OpenAI({ apiKey: api_key });

        const questionAnswerGenerator = new QuestionAnswerGenerator(5, "Question format", "Answer format");
        const rubricGenerator = new RubricGenerator(api_key);

        this.pdfProcessor = new PDFProcessor(api_key, questionAnswerGenerator, rubricGenerator, "gpt-3.5-turbo");
    }

    /**
     * Deprecated: This method is no longer in use.
     * It exists solely to satisfy the AiService interface.
     */
    async generateQuestions(pdf_name: string): Promise<string> {
        throw new Error("Deprecated method, generateQuestions(pdf_name: string). Do not use.");
    }

    async generateNQuestionsAndAnswers(pdf_name: string, number_of_questions: number): Promise<QuestionAnswer[]> {
        const pdfContent = await this.pdfProcessor.processPDF(path.join(this.pdf_dir, pdf_name)); // Use PDFProcessor to read the PDF

        let prompt: string = `
            Using the text below, please create ${number_of_questions} questions. They should be in the format of:
            QUESTION:... ANSWER:...
        `.trim();

        const params: OpenAI.Chat.ChatCompletionCreateParams = {
            messages: [{ role: 'user', content: `${prompt} ${pdfContent}`.trim() }],
            model: "gpt-4o-2024-08-06"
        };

        const completion = await this.client.chat.completions.create(params);

        if (typeof completion.choices[0].message.content !== "string") {
            throw new Error("Did not receive a message from OpenAI.");
        }

        try {
            return this.parseQAndA(completion.choices[0].message.content);
        } catch (e) {
            throw new Error("Chat completion format incorrect.");
        }
    }

    async saveQuestionsAndAnswers(content: QuestionAnswer[], file_name: string): Promise<string> {
        try {
            await fs.writeFile(path.join(this.question_dir, file_name), JSON.stringify({ content }));
            return file_name;
        } catch (err) {
            throw new Error("Failed to save file.");
        }
    }

    async getQuestions(questions_file: string): Promise<JSONcontent> {
        try {
            const content = await fs.readFile(path.join(this.question_dir, questions_file), 'utf-8');
            return JSON.parse(content);
        } catch (err) {
            throw new Error("Bad JSON or failed to read file.");
        }
    }

    async regenerateQuestion(pdf_name: string, q_and_a_file: string, regenerate_index: number): Promise<QuestionAnswer[]> {
        const pdfContent = await this.pdfProcessor.processPDF(path.join(this.pdf_dir, pdf_name)); // Use PDFProcessor to read the PDF
        const questionsContent = await this.getQuestions(q_and_a_file);

        const previousQuestions = questionsContent.content.map((qa) => qa.question);
        const newPrompt = `Regenerate a question based on this content, making sure it's not similar to the previous questions: ${previousQuestions.join(', ')}.`;

        const response = await this.client.chat.completions.create({
            model: 'gpt-4o-2024-08-06x',
            messages: [{ role: 'user', content: newPrompt }]
        });

        const regeneratedQuestion = response.choices[0].message?.content;

        questionsContent.content[regenerate_index].question = regeneratedQuestion || "No question generated.";

        await this.saveQuestionsAndAnswers(questionsContent.content, q_and_a_file);

        return questionsContent.content;
    }

    async createRubric(pdf_name: string, q_and_a_file: string): Promise<Rubric[]> {
        const pdfContent = await this.pdfProcessor.processPDF(path.join(this.pdf_dir, pdf_name));
    
        const rubricText = await this.pdfProcessor.generateRubric(pdfContent);
    
        // Parse the rubric string into an array of Rubric[] objects
        const rubric: Rubric[] = JSON.parse(rubricText); 
    
        return rubric;
    }
    

    private parseQAndA(message: string): QuestionAnswer[] {
        const messageTransform = message.replace(/\n/g, '').replace(/\s{2,}/g, '').split('QUESTION: ').map(el => el.split('ANSWER: '));
        messageTransform.shift();

        const q_and_a: QuestionAnswer[] = [];

        for (let i = 0; i < messageTransform.length; i++) {
            q_and_a.push({ question: messageTransform[i][0].trim(), answer: messageTransform[i][1].trim() });
        }

        return q_and_a;
    }
}
