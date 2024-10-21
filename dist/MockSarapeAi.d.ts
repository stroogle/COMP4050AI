import { AiService, JSONcontent, QuestionAnswer, Rubric } from "./AiService";
export declare class MockSarapeAi implements AiService {
    pdf_dir: string;
    question_dir: string;
    api_key: string;
    constructor(pdf_dir: string, question_dir: string, api_key: string);
    regenerateNQuestions(pdf_name: string, number_of_questions: number, question_context: QuestionAnswer[]): Promise<QuestionAnswer[]>;
    createRubric(overview: string, criteria: string[], keywords: string[], unit_outcomes: string[]): Promise<Rubric[]>;
    generateFeedback(pdf_name: string, rubric: Rubric[]): Promise<string>;
    summarizeSubmission(pdf_name: string): Promise<string>;
    generateNQuestionsAndAnswers(pdf_name: string, number_of_questions: number): Promise<QuestionAnswer[]>;
    saveQuestionsAndAnswers(content: QuestionAnswer[], file_name: string): Promise<string>;
    generateQuestions(pdf_name: string): Promise<string>;
    getQuestions(questions_file: string): Promise<JSONcontent>;
}
