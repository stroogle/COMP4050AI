import OpenAI from "openai";
import {AI} from "../AI"

export class AIService implements AI {
    private openai: OpenAI;


    constructor(access_key: string){
        this.openai = new OpenAI({
            apiKey: access_key
        })
    }

    async getQuestions(number_of_questions: number, file_id: string): Promise<string[]> {
        throw new Error("Method not implemented.");
    }
    
}