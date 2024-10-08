export interface AiService {
    /**
     * Deprecated: This function should not be used.
     */
    generateQuestions(pdf_name: string): Promise<string>;

    /**
     * Generates N questions and answers from a given PDF file.
     */
    generateNQuestionsAndAnswers(pdf_name: string, number_of_questions: number): Promise<QuestionAnswer[]>;

    /**
     * Reads questions from a JSON file.
     */
    getQuestions(questions_file: string): Promise<JSONcontent>;

    /**
     * Saves questions and answers to a JSON file.
     */
    saveQuestionsAndAnswers(content: QuestionAnswer[], file_name: string): Promise<string>;

    /**
     * Regenerates a specific question based on index.
     */
    regenerateQuestion(pdf_name: string, q_and_a_file: string, regenerate_index: number): Promise<QuestionAnswer[]>;

    /**
     * Creates a rubric for a given PDF and Q&A file.
     */
    createRubric(pdf_name: string, q_and_a_file: string): Promise<Rubric[]>;
}

export interface QuestionAnswer {
    question: string;
    answer: string;
}

export interface JSONcontent {
    content: Array<QuestionAnswer>;
}

export interface Rubric {
    fail: string;
    pass: string;
    credit: string;
    distinction: string;
    high_distinction: string;
}
