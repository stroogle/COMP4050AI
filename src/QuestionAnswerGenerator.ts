export class QuestionAnswerGenerator {
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

  // Set previously generated questions and answers to avoid duplicates
  setPreviousQuestionsAndAnswers(previousQA: { question: string; answer: string }[]) {
    this.previousQuestionsAndAnswers = previousQA;
  }

  // Generate the prompt for question and answer generation (without numbering)
  generateQuestionPrompt(content: string): string {
    const previousQuestionsAndAnswersString = this.previousQuestionsAndAnswers.length
      ? `Please avoid generating questions or answers similar to the following:\n` +
        this.previousQuestionsAndAnswers
          .map((qa) => `Question: ${qa.question} - Answer: ${qa.answer}`)
          .join("\n") +
        '\n'
      : '';

    return `
      Based on the following content, generate ${this.numberOfQuestions} new and unique questions and their corresponding answers.
      Do not number the questions or answers.

      ${previousQuestionsAndAnswersString}

      Content:
      ${content}

      Format the questions like this (without numbering):
      ${this.questionFormat}

      Format the answers like this:
      ${this.answerFormat}
    `;
  }
}
