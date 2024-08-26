export interface AI {
    getQuestions(number_of_questions: number, file_id: string): Promise<string>;
}