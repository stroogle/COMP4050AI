# COMP4050AI
AI Service for COMP4050

# Install & Update
As this library is not on the npm registry, any updates and installations need to be performed with the below command.

`npm install git+https://github.com/stroogle/COMP4050AI.git`

# Notes
There are two implementations of team Sarape's AI. There is a mock implementation for the backend team to use during development and a production implementation we continue to work on. Both implement the same interface. Please ensure `IS_MOCK` is set to `YES` during development.
```
// .env
IS_MOCK=YES
```

## AiFactory
The AiFactory class hosts one static function used to create an instance of a class that complies with the AiService Interface. It returns either the Mock version when the environement variable `IS_MOCK` is set to `YES`, or a production implementation in all other cases.

```typescript
// Example Usage
import {AiFactory} from "comp5040ai";

const ai = AiFactory.makeAi("./path/to/pdfs", "./path/to/store/results", "open_ai_api_key");
```

## AiService Interface
The AiService interface defines the functions that can be used to interact with our library.

### Noteworthy interfaces
```typescript
export interface QuestionAnswer {
    question: string;
    answer: string;
}

export interface JSONcontent {
    content: Array<QuestionAnswer>
}

export interface Rubric {
    fail: string;
    pass: string;
    credit: string;
    distinction: string;
    high_distinction: string;
    criteria: string;
}
```

#### generateQuestions - DEPRECATED
```typescript
// Example Usage
// ... ai inistialised above

try {
    /*
    * generateQuestions returns a Promise<string> which represents the name given to the resulting file.
    * It is recommended to use it with await so that it unwraps the Promise for you.
    */
    let answer_doc_name: string = await ai.generateQuestions("pdf_name.pdf");
} catch (e) {
    throw new Error("Failed to generate questions");
}
```

#### getQuestions
```typescript
// Example Usage
// ... ai & answer_doc_name inisitalised above

try {
    /*
    * getQuestions returns a Promise<JSONcontent>.
    * It is recommened to use it with await, so that it unwraps the Promise for you.
    */
    let answers: JSONcontent = await ai.getQuestions(answer_doc_name);
} catch (e) {
    throw new Error("Couldn't get questions");
}
```

#### generateNQuestionsAndAnswers
```typescript
// Example Usage
// ... ai initialised above

try {
    /*
    * getQuestionsgenerateNQuestionsAndAnswers returns a Promise<QuestionAnswer[]>.
    * It is recommened to use it with await, so that it unwraps the Promise for you.
    */
    let q_and_a = await ai.generateNQuestionsAndAnswers("sample.pdf", 6)
} catch(e) {
    throw new Error("Failed to generate questions.")
}

```

#### saveQuestionsAndAnswers
```typescript
// Example Usage
// ... ai & q_and_a initialised above
try {
    /*
    * saveQuestionsAndAnswers returns a Promise<string>.
    * It is recommened to use it with await, so that it unwraps the Promise for you.
    */
    let q_and_a = await ai.saveQuestionsAndAnswers(q_and_a, "example.json")
} catch(e) {
    throw new Error("Failed to generate questions.")
}
```

#### regenerateNQuestions
```typescript
// Example Usage
// ... ai & q_and_a initialised above
try {
    /*
    * regenerateNQuestions returns a Promise<QuestionAnswer[]>.
    * It is recommened to use it with await, so that it unwraps the Promise for you.
    */
    let new_questions = await ai.regenerateNQuestions("sample.pdf", 5, q_and_a);
} catch(e) {
    throw new Error("Failed to re-generate questions.")
}
```

#### createRubric
```typescript
// Example Usage
// ... ai & q_and_a initialised above
try {
    /*
    * createRubric returns a Promise<Rubric[]>.
    * It is recommened to use it with await, so that it unwraps the Promise for you.
    */
    let rubric = await ai.createRubric(
        "overviwe of project",
        ["Criteria #1", "Criteria #2"],
        ["strong", "ai", "functional", "agile"],
        ["Compotent engineer", "Good planning"]
    );
} catch(e) {
    throw new Error("Failed to generate rubric.")
}
```

#### summarizeSubmission
```typescript
// Example Usage
// ... ai & q_and_a initialised above
try {
    /*
    * summarizeSubmission returns a Promise<string>.
    * It is recommened to use it with await, so that it unwraps the Promise for you.
    */
    let summary = await ai.summarizeSubmission("sample.pdf")
} catch(e) {
    throw new Error("Failed to generate questions.")
}
```

#### generateFeedback
```typescript
// Example Usage
// ... ai & q_and_a initialised above
try {
    /*
    * generateFeedback returns a Promise<string>.
    * It is recommened to use it with await, so that it unwraps the Promise for you.
    */
    let feedback = await ai.generateFeedback("sample.pdf", rubric);
} catch(e) {
    throw new Error("Failed to generate feedback.")
}
```