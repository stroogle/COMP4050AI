export class RubricGenerator {
    private rubrics: { category: string; description: string }[];
    private numberOfCriteria: number;
    private criteriaFormat: string;
  
    constructor(numberOfCriteria: number, criteriaFormat: string, rubrics: { category: string; description: string }[] = []) {
      this.numberOfCriteria = numberOfCriteria;
      this.criteriaFormat = criteriaFormat;
      this.rubrics = rubrics; // Initialize with any provided rubrics
    }
  
    setRubrics(rubrics: { category: string; description: string }[]) {
      this.rubrics = rubrics;
    }
  
    generateRubricPrompt(content: string): string {
      const rubricDetails = this.rubrics.map(rubric => `Category: ${rubric.category}\nDescription: ${rubric.description}`).join('\n\n');
      return `
        Based on the content provided, evaluate the following rubrics and provide detailed feedback with a score out of 10 for each category:
  
        Content:
        ${content}
  
        Rubrics:
        ${rubricDetails}
      `;
    }
  }
  