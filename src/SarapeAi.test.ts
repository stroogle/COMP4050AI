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

    test("Saving content", async() => {
        let res = await ai.saveQuestionsAndAnswers([], "writeAnswer.json");

        expect(res).toBe("writeAnswer.json");
    })

    test("Generate N Questions", async () => {
        let res = await ai.generateNQuestionsAndAnswers("sample.pdf", 4);

        expect(res.length).toBe(4);
    })

    test("Generate Rubric", async () => {

        const overview = `This course covers a variety of algorithms and data structures, 
        aiming to teach students how to evaluate, design, and implement efficient algorithms.`;

        const criteria = [
            "Algorithm Understanding",
            "Efficiency Evaluation",
            "Design Strategy",
            "Data Structures",
            "Graph Proficiency",
            "Computability Insight"
        ];

        const keywords = ["Algorithms", "Data Structures", "Graphs", "Efficiency", "Sorting", "Heaps", "Computability"];

        const unitOutcomes = [
            "Understand the role of algorithms in solving computational problems.",
            "Be able to design efficient algorithms for various problems.",
            "Apply data structures in practical programming scenarios."
        ];
        console.log(await ai.createRubric(
            overview,
            criteria,
            keywords,
            unitOutcomes
        ));
    }, 50 * 1000)

})