import { AiFactory } from "./AiFactory"
import { QuestionAnswer } from "./AiService";

describe("First test", () => {

    const ai = AiFactory.makeAi(
        "./PDFfiles/",
        "./QuestionsJSON",
        "123"
    )

    let question_doc: string;
    let questions: QuestionAnswer[]

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
        questions = await ai.generateNQuestionsAndAnswers("sample.pdf", 6);
        expect(questions.length).toBe(6);
        
        questions = await ai.generateNQuestionsAndAnswers("sample.pdf", -8);
        expect(questions.length).toBe(0);

        questions = await ai.generateNQuestionsAndAnswers("sample.pdf", 3);
        expect(questions.length).toBe(3);
    })

    test("Saving content to a file", async () => {
        await ai.saveQuestionsAndAnswers(questions, "file_here.json");

        let res = await ai.getQuestions("file_here.json");

        expect(res.content).toEqual(questions)
    })

    test("Question regeneration", async () => {
        let {content} = await ai.getQuestions("file_here.json");

        let new_q_and_a = await ai.regenerateNQuestions("sample.pdf", 3, []);

        expect(new_q_and_a[0].question == content[1].question).toBe(false);

        expect(new_q_and_a.length).toBe(3);
    })

    test("Creating the rubic", async () => {

        let rubric = await ai.createRubric(
            "",
            ["criteria 1", "criteria 2"],
            ["ai", "fluid", "dyanmic"],
            ["string thinker", "capable engineer"]
        );

        expect(rubric.length).toBe(2);

        expect(rubric[0]).toHaveProperty("fail");
        expect(rubric[0]).toHaveProperty("pass");
        expect(rubric[0]).toHaveProperty("credit");
        expect(rubric[0]).toHaveProperty("distinction");
        expect(rubric[0]).toHaveProperty("high_distinction");
        expect(rubric[0]).toHaveProperty("criteria");

    })

    test("Summarizing the pdf file.", async () => {
        let summary = await ai.summarizeSubmission("sample.pdf");

        expect(typeof summary == "string").toBe(true);
    })

    test("Generating feedback.", async () => {
        let feedback = await ai.generateFeedback("sample.pdf", []);

        expect(typeof feedback == "string").toBe(true);
    })
})