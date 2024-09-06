// src/PromptManager.ts

export class PromptManager {
  private numberOfQuestions: number;
  private questionFormat: string;
  private answerFormat: string;
  private previousQuestionsAndAnswers: { question: string; answer: string }[];

  constructor(numberOfQuestions: number, questionFormat: string, answerFormat: string) {
    this.numberOfQuestions = numberOfQuestions;
    this.questionFormat = questionFormat;
    this.answerFormat = answerFormat;
    this.previousQuestionsAndAnswers = [];
  }

  setPreviousQuestionsAndAnswers(previousQA: { question: string; answer: string }[]) {
    this.previousQuestionsAndAnswers = previousQA;
  }

  generatePrompt(content: string): string {
    const previousQuestionsAndAnswersString = this.previousQuestionsAndAnswers.length
      ? `Please avoid generating questions or answers similar to the following questions and answers:\n` +
        this.previousQuestionsAndAnswers
          .map((qa, index) => `${index + 1}. Question: ${qa.question} - Answer: ${qa.answer}`)
          .join("\n") +
        '\n'
      : '';

    return `
      Based on the following content, generate ${this.numberOfQuestions} new questions and their corresponding answers.
      ${previousQuestionsAndAnswersString}
      
      Content:
      ${content}
      
      Format the questions like this:
      ${this.questionFormat}
      
      Format the answers like this:
      ${this.answerFormat}
    `;
  }
}
