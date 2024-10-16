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
    /**
     * This regenerates a specific question from the answer file, using the pdf file for context. It considers the
     * other questions that were asked, so that it doesn't regenerate something similar.
     * @param pdf_name - The name of the pdf file used for the question context.
     * @param q_and_a_file - The q_and_a result file previously generated.
     * @param regenerate_index - The index of the question that you would like regenerated.
     */
    regenerateQuestion(pdf_name: string, q_and_a_file: string, regenerate_index: number): Promise<QuestionAnswer[]>;
    /**
     * Using a pdf_name to find the context, and the name of it's resulting questions, this function returns an array
     * of Rubtic objects the length of the number of questions in q_and_a file. Rubric[i] should correspond with q_and_a[i].question
     * @param pdf_name - The file name of the pdf file used for context.
     * @param q_and_a_file - the q_and_a result file name containing the previously generated questions and results.
     */
    createRubric(pdf_name: string, q_and_a_file: string): Promise<Rubric[]>;

    /**
     * Creates a summary of the document provided
     * @param pdf_name 
     */
    summarizeSubmission(pdf_name: string): Promise<string>;

    /**
     * @precondition q_and_a.length == answers.length
     * @precondition answers[i] corresponds to the question at q_and_a[i]
     * @param pdf_name - Name of the PDF file for context.
     * @param q_and_a - The questions that are set for the user.
     * @param answers - The user's answers
     */
    autoMark(pdf_name: string, q_and_a: QuestionAnswer[], answers: string[]): Promise<Mark[]>;
}

export interface QuestionAnswer {
    question: string;
    answer: string;
}

export interface JSONcontent {
    content: Array<QuestionAnswer>
}

export interface Rubric {
    fail: string;
    pass: string;
    credit: string;
    distinction: string;
    high_distinction: string;
}

type Mark = number;