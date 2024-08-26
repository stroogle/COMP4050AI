import OpenAI from "openai";
import {AI} from "../AI"

export class AIService implements AI {
    private openai: OpenAI;


    constructor(access_key: string){
        this.openai = new OpenAI({
            apiKey: access_key
        })
    }

    async getQuestions(number_of_questions: number, file_id: string): Promise<string> {
        const response = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "user", content: "Hello"},
            ],
            max_tokens: 50
        }).catch(error => {
            throw new Error("Failed to get a response.");
        })

        return response.choices[0].message.content?.trim() as string;
    }
    
}