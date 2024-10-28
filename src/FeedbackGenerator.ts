import { OpenAI } from 'openai'; // Import OpenAI class
import { PDFReader } from './PDFReader'; // Import your existing PDFReader class

// Define the Rubric type
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

export class FeedbackGenerator {
    private openai: OpenAI;
    private pdfReader: PDFReader;

    constructor(openai: OpenAI) {
        this.openai = openai;
        this.pdfReader = new PDFReader(); // Instantiate PDFReader
    }

    /**
     * Generates feedback based on the provided rubric and content extracted from the PDF.
     * @param pdf_name - The path to the PDF file.
     * @param rubric - An array of rubric criteria and grade descriptors.
     * @returns A Promise that resolves to a feedback string.
     */
    async generateFeedback(pdf_name: string, rubric: Rubric[]): Promise<string> {
        try {
            // Use the PDFReader to extract the text content from the PDF
            const content = await this.pdfReader.readPDF(pdf_name);

            // Convert the rubric to a readable string format
            const rubricString = rubric.map(criteria => `
                Criterion: ${criteria.name}
                Fail: ${criteria.gradeDescriptors.Fail}
                Pass: ${criteria.gradeDescriptors.Pass}
                Credit: ${criteria.gradeDescriptors.Credit}
                Distinction: ${criteria.gradeDescriptors.Distinction}
                High Distinction: ${criteria.gradeDescriptors.HighDistinction}
            `).join('\n\n');

            // Create the prompt for OpenAI
            const prompt = `
                Based on the following rubric, provide detailed feedback for the content below:

                Rubric:
                ${rubricString}

                Content:
                ${content}
            `;

            // Call OpenAI to generate the feedback using GPT-4o mini model
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',  // Use GPT-4o Mini model here
                messages: [{ role: 'user', content: prompt }]
            });

            // Return the generated feedback from the response
            if (response.choices && response.choices.length > 0) {
                return response.choices[0].message?.content || '';
            }

            throw new Error('Failed to generate feedback.');
        } catch (error) {
            console.error('Error generating feedback:', error);
            throw error;
        }
    }
}
