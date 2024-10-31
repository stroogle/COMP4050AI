# COMP4050AI
This library is intended for use by Team Mexico's backend development team. It is our implementation of the AI to be used for the project. It utilises ChatGPT under the hood.

## Third Party Libraries Used
```json
"dependencies": {
    "dotenv": "^16.4.5",
    "openai": "^4.55.7",
    "pdf-parse": "^1.1.1",
    "zod": "^3.23.8"
}

"devDependencies": {
    "@babel/preset-env": "^7.25.3",
    "@babel/preset-typescript": "^7.24.7",
    "@types/jest": "^29.5.12",
    "@types/node": "^22.3.0",
    "jest": "^29.7.0",
    "nodemon": "^3.1.4",
    "ts-node": "^10.9.2",
    "typescript": "^5.5.4"
}
```

## Mock Environment
Please ensure the below environment variable is set if you are in development.
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
This function is used to read questions and answers from a JSON document.
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
This function is used to generate a number of questions *n*, which will have attached example answers.
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
This function is used to save a set of questions and answers to a file.
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
This function regenerates a number of questions *n*. It takes a set of questions and answers to avoid generating the same content.
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
This function creates a rubric for an assignment from the content received.
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
This function creates a short summary of the submission provided.
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
This function creates feedback for the submission provided based on a given rubric.
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

## Acknowledgements
[TO BE FILLED IN]