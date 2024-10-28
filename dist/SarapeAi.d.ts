import { AiService, JSONcontent, QuestionAnswer, Rubric } from "./AiService";
import OpenAI from "openai";
import { RubricGenerator } from "./RubricGenerator";
import { FeedbackGenerator } from "./FeedbackGenerator";
export declare class SarapeAi implements AiService {
    pdf_dir: string;
    question_dir: string;
    client: OpenAI;
    rubricGenerator: RubricGenerator;
    feedbackGenerator: FeedbackGenerator;
    constructor(pdf_dir: string, question_dir: string, api_key: string);
    regenerateNQuestions(pdf_name: string, number_of_questions: number, question_context: QuestionAnswer[]): Promise<QuestionAnswer[]>;
    createRubric(overview: string, criteria: string[], keywords: string[], unit_outcomes: string[]): Promise<Rubric[]>;
    generateFeedback(pdf_name: string, rubric: Rubric[]): Promise<string>;
    summarizeSubmission(pdf_name: string): Promise<string>;
    autoMark(pdf_name: string, q_and_a: QuestionAnswer[], answers: string[]): Promise<number[]>;
    generateNQuestionsAndAnswers(pdf_name: string, number_of_questions: number): Promise<QuestionAnswer[]>;
    saveQuestionsAndAnswers(content: QuestionAnswer[], file_name: string): Promise<string>;
    generateQuestions(pdf_name: string): Promise<string>;
    getQuestions(questions_file: string): Promise<JSONcontent>;
    private parseQAndA;
}
