import fs from "fs/promises"
import * as path from "path";
import { AiService, JSONcontent, QuestionAnswer } from "./AiService";
import z, { ZodError } from "zod";


export class SarapeAi implements AiService{

    pdf_dir: string;
    question_dir: string;
    api_key: string;

    constructor(
        pdf_dir: string,
        question_dir: string,
        api_key: string
    ) {
        this.pdf_dir = pdf_dir;
        this.question_dir = question_dir;
        this.api_key = api_key;
    }

    async generateNQuestionsAndAnswers(pdf_name: string, number_of_questions: number): Promise<QuestionAnswer[]> {
        throw new Error("Method not implemented.");
    }

    async saveQuestionsAndAnswers(content: QuestionAnswer[], file_name: string): Promise<string> {
        throw new Error("Method not implemented.");
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

}