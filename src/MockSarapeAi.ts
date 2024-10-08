import * as path from "path";
import { AiService, JSONcontent, QuestionAnswer, Rubric } from "./AiService";
import fs from "fs/promises";

export class MockSarapeAi implements AiService {

    pdf_dir: string;
    question_dir: string;
    api_key: string;

    constructor(pdf_dir: string, question_dir: string, api_key: string) {
        this.pdf_dir = pdf_dir;
        this.question_dir = question_dir;
        this.api_key = api_key;
    }

    /**
     * Deprecated: Exists solely to satisfy the interface.
     */
    async generateQuestions(pdf_name: string): Promise<string> {
        throw new Error("Deprecated method, generateQuestions(pdf_name: string). Do not use.");
    }

    /**
     * Mock method to generate N questions and answers.
     */
    async generateNQuestionsAndAnswers(pdf_name: string, number_of_questions: number): Promise<QuestionAnswer[]> {
        let questions_and_answers: QuestionAnswer[] = [];

        for (let i = 0; i < number_of_questions; i++) {
            questions_and_answers.push({
                answer: "This is a mock answer.",
                question: "This is a mock question."
            });
        }

        return questions_and_answers;
    }

    /**
     * Mock method to save questions and answers to a file.
     */
    async saveQuestionsAndAnswers(content: QuestionAnswer[], file_name: string): Promise<string> {
        await fs.writeFile(path.join(this.question_dir, file_name), JSON.stringify({ content }));
        return file_name;
    }

    /**
     * Mock method to retrieve questions from a file.
     */
    async getQuestions(questions_file: string): Promise<JSONcontent> {
        const content = await fs.readFile(path.join(this.question_dir, questions_file), "utf-8");
        return JSON.parse(content);
    }

    /**
     * Mock method to regenerate a specific question.
     */
    async regenerateQuestion(pdf_name: string, q_and_a_file: string, regenerate_index: number): Promise<QuestionAnswer[]> {
        const questionsContent = await this.getQuestions(q_and_a_file);

        // Mock logic to "regenerate" the question
        questionsContent.content[regenerate_index].question = "This is a mock regenerated question.";

        await this.saveQuestionsAndAnswers(questionsContent.content, q_and_a_file);

        return questionsContent.content;
    }

    /**
     * Mock method to create a rubric based on the content of the PDF and Q&A.
     */
    async createRubric(pdf_name: string, q_and_a_file: string): Promise<Rubric[]> {
        // Simulated rubric generation
        return [
            { fail: "Did not meet expectations", pass: "Met expectations", credit: "Good performance", distinction: "Excellent", high_distinction: "Outstanding" }
        ];
    }
}
