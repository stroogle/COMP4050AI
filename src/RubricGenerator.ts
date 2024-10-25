import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

type Rubric = {
    name: string;
    gradeDescriptors: {
        Fail: string;
        Pass: string;
        Credit: string;
        Distinction: string;
        HighDistinction: string;
    };
};

export class RubricGenerator {
    private openai: OpenAI;

    constructor(apiKey: string) {
        this.openai = new OpenAI({ apiKey });
    }

    /**
     * Creates a rubric based on the provided overview, criteria, keywords, and unit outcomes.
     * @param overview - An overview or description of the assignment.
     * @param criteria - Specific criteria that should be evaluated in the rubric.
     * @param keywords - Any specific keywords or topics that should be emphasized.
     * @param unit_outcomes - Learning outcomes that the rubric should map to.
     * @returns A promise that resolves to a structured list of rubric criteria with grade descriptors.
     */
    async createRubric(overview: string, criteria: string[], keywords: string[], unit_outcomes: string[]): Promise<Rubric[]> {
        // Build the prompt based on the provided input
        let prompt = `Please generate a detailed marking rubric based on the following information. The rubric should include multiple criteria for evaluation and each criterion should have detailed grade descriptors for Fail, Pass, Credit, Distinction, and High Distinction. \n\n`;

        if (overview) {
            prompt += `Assignment Overview: ${overview}\n\n`;
        }

        if (criteria && criteria.length > 0) {
            prompt += `Evaluation Criteria:\n- ${criteria.join("\n- ")}\n\n`;
        }

        if (keywords && keywords.length > 0) {
            prompt += `Relevant Keywords: ${keywords.join(", ")}\n\n`;
        }

        if (unit_outcomes && unit_outcomes.length > 0) {
            prompt += `Unit Learning Outcomes:\n- ${unit_outcomes.join("\n- ")}\n\n`;
        }

        prompt += `Please structure the output as a JSON object with the following format:\n\n{
          "criteria": [
            {
              "name": "<Criterion Name>",
              "gradeDescriptors": {
                "Fail": "<Detailed description for Fail>",
                "Pass": "<Detailed description for Pass>",
                "Credit": "<Detailed description for Credit>",
                "Distinction": "<Detailed description for Distinction>",
                "HighDistinction": "<Detailed description for High Distinction>"
              }
            },
            ...
          ]
        }`;

        // Send the request to OpenAI
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-2024-08-06",
                messages: [{ role: 'user', content: prompt }],
            });

            let generatedRubric = response.choices?.[0]?.message?.content || null;

            if (!generatedRubric) {
                throw new Error('Failed to generate rubric.');
            }

            // Clean the output and parse the JSON
            generatedRubric = generatedRubric.replace(/```json|```/g, '').trim();

            // Parse the cleaned-up JSON
            return JSON.parse(generatedRubric).criteria as Rubric[];
        } catch (error) {
            console.error('Error generating rubric:', error);
            throw new Error('Failed to generate rubric.');
        }
    }
}