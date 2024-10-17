import * as path from "path"
import { AiService, JSONcontent, QuestionAnswer, Rubric } from "./AiService";
import fs from "fs/promises";

export class MockSarapeAi implements AiService {

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

    async regenerateNQuestions(pdf_name: string, number_of_questions: number, question_context: QuestionAnswer[]): Promise<QuestionAnswer[]> {
        try {

            let new_questions = await this.generateNQuestionsAndAnswers(pdf_name, number_of_questions);

            for(let i = 0; i < number_of_questions; i++) {
                new_questions[i].question += Math.random();
            }


            return new_questions;

        } catch (error) {
            throw new Error("Failed to regenerate question.")
        }
    }

    async createRubric(overview: string, criteria: string[], keywords: string[], unit_outcomes: string[]): Promise<Rubric[]> {
        try {
            // const q_and_a = await this.getQuestions(q_and_a_file);
            
            let rubric: Rubric[] = [];

            for(let i = 0; i < criteria.length; i++) {
                rubric.push({
                    fail: "Lorem ipsum odor amet, consectetuer adipiscing elit. Hendrerit mattis et hac in pretium maecenas!",
                    pass: "Lorem ipsum odor amet, consectetuer adipiscing elit. Hendrerit mattis et hac in pretium maecenas!",
                    credit: "Lorem ipsum odor amet, consectetuer adipiscing elit. Hendrerit mattis et hac in pretium maecenas!",
                    distinction: "Lorem ipsum odor amet, consectetuer adipiscing elit. Hendrerit mattis et hac in pretium maecenas!",
                    high_distinction: "Lorem ipsum odor amet, consectetuer adipiscing elit. Hendrerit mattis et hac in pretium maecenas!",
                    criteria: `Critera #${i}`
                })
            }

            return rubric;
        } catch(error) {
            throw new Error("Failed to create rubric.")
        }
    }

    async generateFeedback(pdf_name: string, rubric: Rubric[]): Promise<string> {
        return "Lorem ipsum odor amet, consectetuer adipiscing elit. Taciti ornare lectus dolor pulvinar dictum. Praesent faucibus placerat habitasse hac taciti sagittis quisque fusce. Ex suscipit neque parturient aenean pharetra per faucibus conubia libero. Mi vitae felis maecenas fames nostra placerat consequat. Donec magna sit ipsum parturient aptent dictum venenatis. Semper mollis taciti lobortis; pharetra at luctus malesuada.\n\nInterdum imperdiet condimentum penatibus dapibus sociosqu semper tellus est. Nascetur iaculis nec finibus himenaeos tempor; potenti in. Accumsan primis ornare aliquam rutrum, molestie aliquam. Facilisis taciti taciti libero rutrum non pellentesque dapibus nisl. Natoque posuere neque et, himenaeos scelerisque sollicitudin. Enim feugiat purus vulputate ipsum massa nec. Turpis metus ac sapien lacus ac suspendisse tempus.";
    }

    async summarizeSubmission(pdf_name: string): Promise<string> {
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
    
    async generateNQuestionsAndAnswers(pdf_name: string, number_of_questions: number): Promise<QuestionAnswer[]> {
    
        let questions_and_answers: QuestionAnswer[] = [];

        for(let i = 0; i < number_of_questions; i++)
            questions_and_answers.push({
                answer: "example answer",
                question: "Lorem ipsum odor amet, consectetuer adipiscing elit. Aptent ullamcorper ultrices mi platea nostra efficitur viverra. Sollicitudin imperdiet mollis maecenas fusce facilisi inceptos penatibus ultricies. Duis eleifend mollis mauris ligula risus tellus litora tortor. Elementum lobortis neque tristique hendrerit et interdum. Sociosqu facilisis sem curabitur scelerisque nullam amet sapien lobortis. Tempus eros ornare ante ligula per; sollicitudin bibendum dapibus."
            });

        return questions_and_answers;

    }

    async saveQuestionsAndAnswers(content: QuestionAnswer[], file_name: string): Promise<string> {

        await fs.writeFile(path.join(this.question_dir, file_name), JSON.stringify({
            content
        }));

        return file_name;
    }

    async generateQuestions(pdf_name: string): Promise<string> {
        const question_file_name = `${pdf_name}_questions.json`;

        const questions: JSONcontent = {
            content: [
                {
                    answer: "example answer",
                    question: "Lorem ipsum odor amet, consectetuer adipiscing elit. Aptent ullamcorper ultrices mi platea nostra efficitur viverra. Sollicitudin imperdiet mollis maecenas fusce facilisi inceptos penatibus ultricies. Duis eleifend mollis mauris ligula risus tellus litora tortor. Elementum lobortis neque tristique hendrerit et interdum. Sociosqu facilisis sem curabitur scelerisque nullam amet sapien lobortis. Tempus eros ornare ante ligula per; sollicitudin bibendum dapibus."
                },
                {
                    question: "Lorem ipsum odor amet, consectetuer adipiscing elit. Aptent ullamcorper ultrices mi platea nostra efficitur viverra. Sollicitudin imperdiet mollis maecenas fusce facilisi inceptos penatibus ultricies. Duis eleifend mollis mauris ligula risus tellus litora tortor. Elementum lobortis neque tristique hendrerit et interdum. Sociosqu facilisis sem curabitur scelerisque nullam amet sapien lobortis. Tempus eros ornare ante ligula per; sollicitudin bibendum dapibus.",
                    answer: "example answer"
                },
                {
                    question: "Lorem ipsum odor amet, consectetuer adipiscing elit. Aptent ullamcorper ultrices mi platea nostra efficitur viverra. Sollicitudin imperdiet mollis maecenas fusce facilisi inceptos penatibus ultricies. Duis eleifend mollis mauris ligula risus tellus litora tortor. Elementum lobortis neque tristique hendrerit et interdum. Sociosqu facilisis sem curabitur scelerisque nullam amet sapien lobortis. Tempus eros ornare ante ligula per; sollicitudin bibendum dapibus.",
                    answer: "example answer"
                },
                {
                    answer: "example answer",
                    question: "Lorem ipsum odor amet, consectetuer adipiscing elit. Aptent ullamcorper ultrices mi platea nostra efficitur viverra. Sollicitudin imperdiet mollis maecenas fusce facilisi inceptos penatibus ultricies. Duis eleifend mollis mauris ligula risus tellus litora tortor. Elementum lobortis neque tristique hendrerit et interdum. Sociosqu facilisis sem curabitur scelerisque nullam amet sapien lobortis. Tempus eros ornare ante ligula per; sollicitudin bibendum dapibus.",
                },
            ]
        };

        await fs.writeFile(path.join(this.question_dir, question_file_name), JSON.stringify(questions));

        return question_file_name;
    }
    async getQuestions(questions_file: string): Promise<JSONcontent> {
        const content = await fs.readFile(path.join(this.question_dir, questions_file), "utf-8");
        return JSON.parse(content)
    }

}