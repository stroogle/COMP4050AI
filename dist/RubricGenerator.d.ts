export declare class RubricGenerator {
    private openai;
    constructor(apiKey: string);
    /**
     * This function sends the content to OpenAI and asks it to generate a rubric with criteria and grade descriptors.
     * The rubric is returned as a structured JSON object.
     * @param content - The content from which the rubric is generated.
     * @returns A JSON object representing the rubric.
     */
    generateRubricFromContent(content: string): Promise<any>;
}
