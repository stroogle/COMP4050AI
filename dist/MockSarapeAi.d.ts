import { AiService, JSONcontent, QuestionAnswer } from "./AiService";
export declare class MockSarapeAi implements AiService {
    pdf_dir: string;
    question_dir: string;
    api_key: string;
    constructor(pdf_dir: string, question_dir: string, api_key: string);
    generateNQuestionsAndAnswers(pdf_name: string, number_of_questions: number): Promise<QuestionAnswer[]>;
    saveQuestionsAndAnswers(content: QuestionAnswer[], file_name: string): Promise<string>;
    generateQuestions(pdf_name: string): Promise<string>;
    getQuestions(questions_file: string): Promise<JSONcontent>;
}
