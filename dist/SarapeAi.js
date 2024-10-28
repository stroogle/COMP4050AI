"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SarapeAi = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path = __importStar(require("path"));
const zod_1 = __importStar(require("zod"));
const openai_1 = __importDefault(require("openai"));
const PDFReader_1 = require("./PDFReader");
const RubricGenerator_1 = require("./RubricGenerator");
const FeedbackGenerator_1 = require("./FeedbackGenerator");
class SarapeAi {
    constructor(pdf_dir, question_dir, api_key) {
        this.pdf_dir = pdf_dir;
        this.question_dir = question_dir;
        this.client = new openai_1.default({
            apiKey: api_key
        });
        this.rubricGenerator = new RubricGenerator_1.RubricGenerator(api_key);
        this.feedbackGenerator = new FeedbackGenerator_1.FeedbackGenerator(this.client);
    }
    regenerateNQuestions(pdf_name, number_of_questions, question_context) {
        throw new Error("Method not implemented.");
    }
    createRubric(overview, criteria, keywords, unit_outcomes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rubricGenerator.createRubric(overview, criteria, keywords, unit_outcomes);
        });
    }
    generateFeedback(pdf_name, rubric) {
        return __awaiter(this, void 0, void 0, function* () {
            // 
            throw new Error("Method not implemented.");
        });
    }
    summarizeSubmission(pdf_name) {
        throw new Error("Method not implemented.");
    }
    autoMark(pdf_name, q_and_a, answers) {
        throw new Error("Method not implemented.");
    }
    generateNQuestionsAndAnswers(pdf_name, number_of_questions) {
        return __awaiter(this, void 0, void 0, function* () {
            let pdf_content = yield (new PDFReader_1.PDFReader()).readPDF(path.join(this.pdf_dir, pdf_name));
            let prompt = `
            Using the text below, please create ${number_of_questions} questions. They should be in the format of:
            QUESTION:... ANSWER:...
        `.trim();
            const params = {
                messages: [
                    {
                        role: 'user',
                        content: `
                        ${prompt}

                        ${pdf_content}
                    `.trim()
                    }
                ],
                model: "gpt-3.5-turbo"
            };
            const completion = yield this.client.chat.completions.create(params);
            if (typeof completion.choices[0].message.content != "string")
                throw new Error("Did not receive a message from OpenAI.");
            try {
                const q_and_a = this.parseQAndA(completion.choices[0].message.content);
                return q_and_a;
            }
            catch (e) {
                throw new Error("Chat completion format incorrect.");
            }
        });
    }
    saveQuestionsAndAnswers(content, file_name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield promises_1.default.writeFile(path.join(this.question_dir, file_name), JSON.stringify({
                    content
                }));
                return file_name;
            }
            catch (err) {
                throw new Error("Failed to save file.");
            }
        });
    }
    generateQuestions(pdf_name) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Depreciated method, generateQuestions(pdf_name: string). Do not use.");
        });
    }
    getQuestions(questions_file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const content = yield promises_1.default.readFile(path.join(this.question_dir, questions_file), "utf-8");
                const content_json = JSON.parse(content);
                // Validate the content_json object
                let schema = zod_1.default.object({
                    content: zod_1.default.array(zod_1.default.object({
                        question: zod_1.default.string(),
                        answer: zod_1.default.string()
                    }))
                });
                schema.parse(content_json);
                return JSON.parse(content);
            }
            catch (err) {
                switch (err.constructor) {
                    case zod_1.ZodError:
                        throw new Error("Bad file content.");
                    default:
                        throw new Error("Bad JSON or failed to read file.");
                }
            }
        });
    }
    parseQAndA(message) {
        const message_transform = message.replace(/\n/g, "").replace(/\s{2,}/g, "").split("QUESTION: ").map((el) => el.split("ANSWER: "));
        message_transform.shift();
        const q_and_a = [];
        for (let i = 0; i < message_transform.length; i++)
            q_and_a.push({
                question: message_transform[i][0].trim(),
                answer: message_transform[i][1].trim()
            });
        return q_and_a;
    }
}
exports.SarapeAi = SarapeAi;
//# sourceMappingURL=SarapeAi.js.map