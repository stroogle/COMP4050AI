import { OpenAI } from 'openai';
export declare class FeedbackGenerator {
    private openai;
    constructor(openai: OpenAI);
    generateFeedback(content: string, rubric: string): Promise<string>;
}
