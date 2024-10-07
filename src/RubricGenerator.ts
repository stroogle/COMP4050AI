export class RubricGenerator {
  private rubrics: { category: string; description: string }[];

  constructor(rubrics: { category: string; description: string }[] = []) {
    this.rubrics = rubrics;
  }

  // Set custom rubrics
  setRubrics(rubrics: { category: string; description: string }[]) {
    this.rubrics = rubrics;
  }

  // Generate rubric prompt
  generateRubricPrompt(content: string): string {
    const rubricDetails = this.rubrics
      .map(rubric => `Category: ${rubric.category}\nDescription: ${rubric.description}`)
      .join('\n\n');

    return `
      Based on the content provided, generate a rubric with the following categories:

      Content:
      ${content}

      Rubrics:
      ${rubricDetails}
    `;
  }

  generateRubric(): { category: string; description: string }[] {
    return this.rubrics;
  }
}
