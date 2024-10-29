import fs from "fs/promises"
import * as path from "path";
import { AiService, JSONcontent, QuestionAnswer, Rubric } from "./AiService";
import z, { ZodError } from "zod";
import OpenAI from "openai";
import { PDFReader } from "./PDFReader";
import { RubricGenerator } from "./RubricGenerator";
import { FeedbackGenerator } from "./FeedbackGenerator";

export class SarapeAi implements AiService{

    pdf_dir: string;
    question_dir: string;
    client: OpenAI;
    rubricGenerator: RubricGenerator;
    feedbackGenerator: FeedbackGenerator;

    constructor(
        pdf_dir: string,
        question_dir: string,
        api_key: string
    ) {
        this.pdf_dir = pdf_dir;
        this.question_dir = question_dir;
        this.client = new OpenAI({
            apiKey: api_key
        })
        this.rubricGenerator = new RubricGenerator(api_key);
        this.feedbackGenerator = new FeedbackGenerator(this.client);
    }

    regenerateNQuestions(pdf_name: string, number_of_questions: number, question_context: QuestionAnswer[]): Promise<QuestionAnswer[]> {
        throw new Error("Method not implemented.");
    }

    async createRubric(overview: string, criteria: string[], keywords: string[], unit_outcomes: string[]): Promise<Rubric[]> {
        
        return await this.rubricGenerator.createRubric(overview, criteria, keywords, unit_outcomes);
    }
    
    async generateFeedback(pdf_name: string, rubric: Rubric[]): Promise<string> {
        // 
        throw new Error("Method not implemented.");
    }

    async summarizeSubmission(pdf_name: string): Promise<string> {
        let pdf_content = await (new PDFReader()).readPDF(path.join(this.pdf_dir, pdf_name));
        let prompt: string = `
            Using the text below, please create a brief summary about the brief. Do not include any additional response text, I only want the summary.
        `.trim();

        const params: OpenAI.Chat.ChatCompletionCreateParams = {
            messages: [
                {
                    role: 'user',
                    content: `
                        ${prompt}

                        ${pdf_content}
                    `.trim()
                }
            ],
            model: "gpt-3.5-turbo"
        }

        const completion = await this.client.chat.completions.create(params);

        if(typeof completion.choices[0].message.content != "string")
            throw new Error("Did not receive a message from OpenAI.")

        return completion.choices[0].message.content;
    }

    autoMark(pdf_name: string, q_and_a: QuestionAnswer[], answers: string[]): Promise<number[]> {
        throw new Error("Method not implemented.");
    }

    async generateNQuestionsAndAnswers(pdf_name: string, number_of_questions: number): Promise<QuestionAnswer[]> {

        let pdf_content = await (new PDFReader()).readPDF(path.join(this.pdf_dir, pdf_name));
        let prompt: string = `
            Using the text below, please create ${number_of_questions} questions. They should be in the format of:
            QUESTION:... ANSWER:...
        `.trim();

        const params: OpenAI.Chat.ChatCompletionCreateParams = {
            messages: [
                {
                    role: 'user',
                    content: `
                        ${prompt}

                        ${pdf_content}
                    `.trim()
                }
            ],
            model: "gpt-3.5-turbo"
        }

        const completion = await this.client.chat.completions.create(params);

        if(typeof completion.choices[0].message.content != "string")
            throw new Error("Did not receive a message from OpenAI.")
        
        try {
            const q_and_a = this.parseQAndA(completion.choices[0].message.content);
            
            return q_and_a;
        } catch (e) {
            throw new Error("Chat completion format incorrect.")
        }

    }

    async saveQuestionsAndAnswers(content: QuestionAnswer[], file_name: string): Promise<string> {
        try {
            await fs.writeFile(path.join(this.question_dir, file_name), JSON.stringify({
                content
            }));

            return file_name;
        } catch (err) {
            throw new Error("Failed to save file.");
        }

    }
    
    async generateQuestions(pdf_name: string): Promise<string> {
        throw new Error("Depreciated method, generateQuestions(pdf_name: string). Do not use.");
    }

    async getQuestions(questions_file: string): Promise<JSONcontent> {
        try {
            const content = await fs.readFile(path.join(this.question_dir, questions_file), "utf-8");

            const content_json: JSONcontent = JSON.parse(content);

            // Validate the content_json object

            let schema = z.object({
                content: z.array(z.object({
                    question: z.string(),
                    answer: z.string()
                }))
            })

            schema.parse(content_json);

            return JSON.parse(content)
        } catch (err) {
            switch((err as Error).constructor) {
                case ZodError:
                    throw new Error("Bad file content.");
                default:
                    throw new Error("Bad JSON or failed to read file.");
            }
        }
    }

    private parseQAndA(message: string): QuestionAnswer[] {
        const message_transform = message.replace(/\n/g, "").replace(/\s{2,}/g, "").split("QUESTION: ").map((el) => el.split("ANSWER: "));
        message_transform.shift()
        
        const q_and_a: QuestionAnswer[] = [];

        for(let i = 0; i < message_transform.length; i++)
            q_and_a.push({
                question: message_transform[i][0].trim(),
                answer: message_transform[i][1].trim()
            })

        return q_and_a;
    }

}