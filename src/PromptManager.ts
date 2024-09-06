export class PromptManager {
  private numberOfQuestions: number;
  private questionFormat: string;
  private answerFormat: string;
  private previousQuestions: string[];

  constructor(numberOfQuestions: number, questionFormat: string, answerFormat: string) {
    this.numberOfQuestions = numberOfQuestions;
    this.questionFormat = questionFormat;
    this.answerFormat = answerFormat;
    this.previousQuestions = []; // Initialize with an empty array
  }

  setPreviousQuestions(previousQuestions: string[]) {
    this.previousQuestions = previousQuestions;
  }

  generatePrompt(content: string): string {
    const randomIntro = this.getRandomIntro();
    const previousQuestionsString = this.previousQuestions.length
      ? `Do not generate any questions similar to these: \n${this.previousQuestions.join("\n")}\n`
      : '';

    return `
      ${randomIntro}
      
      Based on the following content, generate ${this.numberOfQuestions} new questions and their corresponding answers.
      ${previousQuestionsString}
      
      Content:
      ${content}
      
      Format the questions like this:
      ${this.questionFormat}
      
      Format the answers like this:
      ${this.answerFormat}
    `;
  }

  private getRandomIntro(): string {
    const intros = [
      "Imagine you're a teacher preparing new questions to test a student's deep understanding of the material.",
      "You are an examiner creating new questions for a retest to ensure comprehension.",
      "You are designing new questions based on this content to ensure variety and depth.",
    ];
    return intros[Math.floor(Math.random() * intros.length)];
  }
}
