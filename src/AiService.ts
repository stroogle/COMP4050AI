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
     * @precondition - regenerate_index is a valid index.
     * @param pdf_name - The name of the pdf file used for the question context.
     * @param question_context - These give a clue to the ai as to which questions to avoid asking.
     */
    regenerateNQuestions(pdf_name: string, number_of_questions: number, question_context: QuestionAnswer[]): Promise<QuestionAnswer[]>;
    /**
     * Using a pdf_name to find the context, and the name of it's resulting questions, this function returns an array
     * of Rubtic objects.
     * @param project_pdf - The name of the pdf containing the instructions for the porject.
     * @param unit_guide_pdf - The name of the pdf holding the unit_guide.
     */
    createRubric(overview: string, criteria: string[], keywords: string[], unit_outcomes: string[]): Promise<Rubric[]>;

    /**
     * Creates a summary of the document provided
     * @param pdf_name - The name of the pdf containing the students submission.
     */
    summarizeSubmission(pdf_name: string): Promise<string>;

    /**
     * Creates feedback for the submission based on the rubric. Not marked.
     * @param pdf_name  - Name of the pdf file containing the student submission.
     * @param rubric - The marking rubric to base the feedback on.
     */
    generateFeedback(pdf_name: string, rubric: Rubric[]): Promise<string>;
    
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
    criteria: string;
}