import * as path from "path"
import { AiService, JSONcontent, QuestionAnswer } from "./AiService";
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
    generateNQuestions(pdf_name: string, number_of_questions: number): Promise<QuestionAnswer[]> {
        
        const q: QuestionAnswer = {
                    answer: "example answer",
                    question: "Lorem ipsum odor amet, consectetuer adipiscing elit. Aptent ullamcorper ultrices mi platea nostra efficitur viverra. Sollicitudin imperdiet mollis maecenas fusce facilisi inceptos penatibus ultricies. Duis eleifend mollis mauris ligula risus tellus litora tortor. Elementum lobortis neque tristique hendrerit et interdum. Sociosqu facilisis sem curabitur scelerisque nullam amet sapien lobortis. Tempus eros ornare ante ligula per; sollicitudin bibendum dapibus."
                };
        
        const return_value: QuestionAnswer[] = [];

        for(let i = 0; i < number_of_questions; i++)
            return_value.push(q);

        return Promise.resolve(return_value)
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