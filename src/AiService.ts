export interface AiService {
    generateQuestions(pdf_name: string): Promise<string>;
    generateNQuestionsAndAnswers(pdf_name: string, number_of_questions: number): Promise<QuestionAnswer[]>;
    getQuestions(questions_file: string): Promise<JSONcontent>;
    saveQuestionsAndAnswers(content: QuestionAnswer[], file_name: string): Promise<string>;
}

export interface QuestionAnswer {
    question: string;
    answer: string;
}

export interface JSONcontent {
    content: Array<QuestionAnswer>
}