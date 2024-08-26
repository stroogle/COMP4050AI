import { AIService } from "./index"

describe("Verify that AI Services runs as expected.", () => {

    let ai = new AIService(process.env.OPENAI_API_KEY as string)

    test("Does ai return the expected amount of questions?", async () => {
        let number_of_questions = 6;
        let responses = await ai.getQuestions(number_of_questions, "123");

        expect(typeof responses == "string").toBe(true);
    })

})