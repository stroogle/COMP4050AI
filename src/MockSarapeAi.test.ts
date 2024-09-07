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
    })

    test("Generate N questions", async () => {
        let questions = await ai.generateNQuestionsAndAnswers("sample.pdf", 6);
        expect(questions.length).toBe(6);

        questions = await ai.generateNQuestionsAndAnswers("sample.pdf", 3);
        expect(questions.length).toBe(3);

        questions = await ai.generateNQuestionsAndAnswers("sample.pdf", -8);
        expect(questions.length).toBe(0);

    })
})