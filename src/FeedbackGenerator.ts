import { RubricGenerator } from './RubricGenerator'; // Import RubricGenerator

export class FeedbackGenerator {
  private rubricGenerator: RubricGenerator;

  constructor(rubricGenerator: RubricGenerator) {
    this.rubricGenerator = rubricGenerator;
  }

  // Generate feedback prompt based on the rubric and content
  generateFeedbackPrompt(content: string): string {
    const rubric = this.rubricGenerator.generateRubric();
    const rubricDetails = rubric
      .map((r: { category: string; description: string }) => `Category: ${r.category}\nDescription: ${r.description}`)
      .join('\n\n');

    return `
      Using the following rubric, provide detailed feedback on the content below:

      Content:
      ${content}

      Rubric:
      ${rubricDetails}
    `;
  }
}
