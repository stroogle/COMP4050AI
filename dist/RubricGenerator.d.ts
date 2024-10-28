import { Rubric } from './AiService';
export declare class RubricGenerator {
    private openai;
    constructor(apiKey: string);
    /**
     * Creates a rubric based on the provided overview, criteria, keywords, and unit outcomes.
     * @param overview - An overview or description of the assignment.
     * @param criteria - Specific criteria that should be evaluated in the rubric.
     * @param keywords - Any specific keywords or topics that should be emphasized.
     * @param unit_outcomes - Learning outcomes that the rubric should map to.
     * @returns A promise that resolves to a structured list of rubric criteria with grade descriptors.
     */
    createRubric(overview: string, criteria: string[], keywords: string[], unit_outcomes: string[]): Promise<Rubric[]>;
}
