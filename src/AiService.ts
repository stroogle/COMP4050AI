export interface AiService {
    generateQuestions(pdf_name: string): Promise<string>;
    getQuestions(questions_file: string): Promise<Array<Question>>;
}

export interface Question {
    question_id: number;
    question: string;
}