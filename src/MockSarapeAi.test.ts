import { AiFactory } from "./AiFactory"

describe("First test", () => {

    const ai = AiFactory.makeAi(
        "./PDFfiles/",
        "./QuestionsJSON",
        "123"
    )

    let question_doc: string;

    test("Gen Questions", async () => {
        const file = await ai.generateQuestions("sample.pdf");
        question_doc = file;
        expect(file).toBe("sample.pdf_questions.json");
    })

    test("Read Questions", async () => {
        const questions = await ai.getQuestions(question_doc);
        expect(questions.content.length).toBe(4);
        console.log(questions);
    })
})