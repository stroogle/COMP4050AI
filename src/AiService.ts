export interface AiService {
    generateQuestions(pdf_name: string): Promise<string>;
    getQuestions(questions_file: string): Promise<JSONcontent>;
}

export interface QuestionAnswer {
    question: string;
    answer: string;
}

export interface JSONcontent {
    content: Array<QuestionAnswer>
}