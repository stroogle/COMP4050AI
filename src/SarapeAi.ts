import { Path } from "glob";
import { AiService, JSONcontent, QuestionAnswer } from "./AiService";


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
    generateNQuestions(pdf_name: string, number_of_questions: number): Promise<QuestionAnswer[]> {
        throw new Error("Method not implemented.");
    }
    
    generateQuestions(pdf_name: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    getQuestions(questions_file: string): Promise<JSONcontent> {
        throw new Error("Method not implemented.");
    }

}