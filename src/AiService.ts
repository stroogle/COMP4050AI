export interface AiService {
    /**
     * It is not recommended to use this function anymore, it will consistently throw errors.
     * @deprecated
     * @param pdf_name 
     */
    generateQuestions(pdf_name: string): Promise<string>;
    /**
     * Generate N questions and answers for a given pdf file.
     * @param pdf_name - Name of the pdf file to be parsed.
     * @param number_of_questions - The number of questions and answers to be produced.
     * @returns An array of questions and answers.
     */
    generateNQuestionsAndAnswers(pdf_name: string, number_of_questions: number): Promise<QuestionAnswer[]>;
    /**
     * Reads and parses the content of one of the produced JSON files.
     * @param questions_file - Name of the file that contains the quesions and answers.
     */
    getQuestions(questions_file: string): Promise<JSONcontent>;
    /**
     * Saves an attay of questions and answers into a given json file. 
     * @param content - An array of questions and answers.
     * @param file_name - Name of the file to save to.
     * @returns The name of the file the content was saved to.
     */
    saveQuestionsAndAnswers(content: QuestionAnswer[], file_name: string): Promise<string>;
}

export interface QuestionAnswer {
    question: string;
    answer: string;
}

export interface JSONcontent {
    content: Array<QuestionAnswer>
}