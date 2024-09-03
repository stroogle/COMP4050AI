export declare class AIService {
    private openai;
    constructor(apiKey: string);
    getQuestions(questionCount: number, content: string): Promise<string>;
}
