import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

export class RubricGenerator {
    private openai: OpenAI;

    constructor(apiKey: string) {
        this.openai = new OpenAI({ apiKey });
    }

    /**
     * This function sends the content to OpenAI and asks it to generate a rubric with criteria and grade descriptors.
     * The rubric is returned as a structured JSON object.
     * @param content - The content from which the rubric is generated.
     * @returns A JSON object representing the rubric.
     */
    async generateRubricFromContent(content: string): Promise<any> {
        const prompt = `
            Please analyze the following content and generate a detailed marking rubric.
            The rubric should include the following:
            - Multiple clear criteria for evaluation from the content (two word criteria name at max)
            - Grade descriptors for each criterion (e.g., Fail, Pass, Credit, Distinction, High Distinction)
            - Each grade descriptor should be elaborate, providing clear distinctions between the levels on what to expect form the content provied for analysis .
        
            
            Return the rubric as a structured JSON object without any additional formatting or Markdown.
            
            Content to analyze:
            ${content}
        `;
    
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-2024-08-06",
                messages: [{ role: 'user', content: prompt }],
            });
    
            // Log the full API response for debugging purposes
           // console.log('Raw API Response:', JSON.stringify(response, null, 2));
    
            let generatedRubric = response.choices?.[0]?.message?.content || null;
    
            if (!generatedRubric) {
                throw new Error('Failed to generate rubric.');
            }
    
            // Strip out the backticks and parse the JSON
            generatedRubric = generatedRubric.replace(/```json|```/g, '').trim();
    
            // Parse the cleaned-up JSON
            return JSON.parse(generatedRubric);
        } catch (error) {
            console.error('Error generating rubric:', error);
            throw new Error('Failed to generate rubric.');
        }
    }
    
}
