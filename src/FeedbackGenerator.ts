import { OpenAI } from 'openai'; // Import OpenAI class

export class FeedbackGenerator {
    private openai: OpenAI;

    constructor(openai: OpenAI) {
        this.openai = openai;
    }

    async generateFeedback(content: string, rubric: string): Promise<string> {
        const prompt = `
            Based on the following rubric, provide detailed feedback for the content below:
            
            Rubric:
            ${rubric}

            Content:
            ${content}
        `;

        const response = await this.openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }]
        });

        if (response.choices && response.choices.length > 0) {
            return response.choices[0].message?.content || '';
        }

        throw new Error('Failed to generate feedback.');
    }
}
