import { AiService, JSONcontent } from "./AiService";
export declare class SarapeAi implements AiService {
    pdf_dir: string;
    question_dir: string;
    api_key: string;
    constructor(pdf_dir: string, question_dir: string, api_key: string);
    generateQuestions(pdf_name: string): Promise<string>;
    getQuestions(questions_file: string): Promise<JSONcontent>;
}
