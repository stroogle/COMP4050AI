import { SarapeAi } from "./SarapeAi"

describe("Sarape AI tests", () => {

    let ai = new SarapeAi("./PDFfiles", "./testFiles/testJson", process.env.OPEN_AI_KEY as string)
   
    test("Get questions", async () => {

        // File with no JSON

        await expect(ai.getQuestions("empty.json")).rejects.toThrow("Bad JSON or failed to read file.")

        // File with wrong JSON
        await expect(ai.getQuestions("wrong.json")).rejects.toThrow("Bad file content.")

        // File with right JSON, empty content
        let res = await ai.getQuestions("correctEmpty.json");
        expect(res.content.length).toBe(0);

        // Normal file.
        res = await ai.getQuestions("correct.json");
        expect(res.content.length).toBe(3);
    })

})