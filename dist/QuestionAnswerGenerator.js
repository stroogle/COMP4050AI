"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionAnswerGenerator = void 0;
class QuestionAnswerGenerator {
    constructor(numberOfQuestions, questionFormat, answerFormat) {
        this.numberOfQuestions = numberOfQuestions;
        this.questionFormat = questionFormat;
        this.answerFormat = answerFormat;
        this.previousQuestionsAndAnswers = [];
    }
    // Getter for numberOfQuestions
    getNumberOfQuestions() {
        return this.numberOfQuestions;
    }
    // Set previously generated questions and answers to avoid duplicates
    setPreviousQuestionsAndAnswers(previousQA) {
        this.previousQuestionsAndAnswers = previousQA;
    }
    // Generate the prompt for question and answer generation (without numbering)
    generateQuestionPrompt(content) {
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
exports.QuestionAnswerGenerator = QuestionAnswerGenerator;
//# sourceMappingURL=QuestionAnswerGenerator.js.map