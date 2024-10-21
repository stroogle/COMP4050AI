export declare class QuestionAnswerGenerator {
    private numberOfQuestions;
    private questionFormat;
    private answerFormat;
    private previousQuestionsAndAnswers;
    constructor(numberOfQuestions: number, questionFormat: string, answerFormat: string);
    getNumberOfQuestions(): number;
    setPreviousQuestionsAndAnswers(previousQA: {
        question: string;
        answer: string;
    }[]): void;
    generateQuestionPrompt(content: string): string;
}
