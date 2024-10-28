import { OpenAI } from 'openai';
type Rubric = {
    name: string;
    gradeDescriptors: {
        Fail: string;
        Pass: string;
        Credit: string;
        Distinction: string;
        HighDistinction: string;
    };
};
export declare class FeedbackGenerator {
    private openai;
    private pdfReader;
    constructor(openai: OpenAI);
    /**
     * Generates feedback based on the provided rubric and content extracted from the PDF.
     * @param pdf_name - The path to the PDF file.
     * @param rubric - An array of rubric criteria and grade descriptors.
     * @returns A Promise that resolves to a feedback string.
     */
    generateFeedback(pdf_name: string, rubric: Rubric[]): Promise<string>;
}
export {};
