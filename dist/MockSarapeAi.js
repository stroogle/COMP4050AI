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
exports.MockSarapeAi = void 0;
const path = __importStar(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
class MockSarapeAi {
    constructor(pdf_dir, question_dir, api_key) {
        this.pdf_dir = pdf_dir;
        this.question_dir = question_dir;
        this.api_key = api_key;
    }
    regenerateNQuestions(pdf_name, number_of_questions, question_context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let new_questions = yield this.generateNQuestionsAndAnswers(pdf_name, number_of_questions);
                for (let i = 0; i < number_of_questions; i++) {
                    new_questions[i].question += Math.random();
                }
                return new_questions;
            }
            catch (error) {
                throw new Error("Failed to regenerate question.");
            }
        });
    }
    createRubric(overview, criteria, keywords, unit_outcomes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const q_and_a = await this.getQuestions(q_and_a_file);
                let rubric = [];
                for (let i = 0; i < criteria.length; i++) {
                    rubric.push({
                        fail: "Lorem ipsum odor amet, consectetuer adipiscing elit. Hendrerit mattis et hac in pretium maecenas!",
                        pass: "Lorem ipsum odor amet, consectetuer adipiscing elit. Hendrerit mattis et hac in pretium maecenas!",
                        credit: "Lorem ipsum odor amet, consectetuer adipiscing elit. Hendrerit mattis et hac in pretium maecenas!",
                        distinction: "Lorem ipsum odor amet, consectetuer adipiscing elit. Hendrerit mattis et hac in pretium maecenas!",
                        high_distinction: "Lorem ipsum odor amet, consectetuer adipiscing elit. Hendrerit mattis et hac in pretium maecenas!",
                        criteria: `Critera #${i}`
                    });
                }
                return rubric;
            }
            catch (error) {
                throw new Error("Failed to create rubric.");
            }
        });
    }
    generateFeedback(pdf_name, rubric) {
        return __awaiter(this, void 0, void 0, function* () {
            return "Lorem ipsum odor amet, consectetuer adipiscing elit. Taciti ornare lectus dolor pulvinar dictum. Praesent faucibus placerat habitasse hac taciti sagittis quisque fusce. Ex suscipit neque parturient aenean pharetra per faucibus conubia libero. Mi vitae felis maecenas fames nostra placerat consequat. Donec magna sit ipsum parturient aptent dictum venenatis. Semper mollis taciti lobortis; pharetra at luctus malesuada.\n\nInterdum imperdiet condimentum penatibus dapibus sociosqu semper tellus est. Nascetur iaculis nec finibus himenaeos tempor; potenti in. Accumsan primis ornare aliquam rutrum, molestie aliquam. Facilisis taciti taciti libero rutrum non pellentesque dapibus nisl. Natoque posuere neque et, himenaeos scelerisque sollicitudin. Enim feugiat purus vulputate ipsum massa nec. Turpis metus ac sapien lacus ac suspendisse tempus.";
        });
    }
    summarizeSubmission(pdf_name) {
        return __awaiter(this, void 0, void 0, function* () {
            return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
        });
    }
    generateNQuestionsAndAnswers(pdf_name, number_of_questions) {
        return __awaiter(this, void 0, void 0, function* () {
            let questions_and_answers = [];
            for (let i = 0; i < number_of_questions; i++)
                questions_and_answers.push({
                    answer: "example answer",
                    question: "Lorem ipsum odor amet, consectetuer adipiscing elit. Aptent ullamcorper ultrices mi platea nostra efficitur viverra. Sollicitudin imperdiet mollis maecenas fusce facilisi inceptos penatibus ultricies. Duis eleifend mollis mauris ligula risus tellus litora tortor. Elementum lobortis neque tristique hendrerit et interdum. Sociosqu facilisis sem curabitur scelerisque nullam amet sapien lobortis. Tempus eros ornare ante ligula per; sollicitudin bibendum dapibus."
                });
            return questions_and_answers;
        });
    }
    saveQuestionsAndAnswers(content, file_name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield promises_1.default.writeFile(path.join(this.question_dir, file_name), JSON.stringify({
                content
            }));
            return file_name;
        });
    }
    generateQuestions(pdf_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const question_file_name = `${pdf_name}_questions.json`;
            const questions = {
                content: [
                    {
                        answer: "example answer",
                        question: "Lorem ipsum odor amet, consectetuer adipiscing elit. Aptent ullamcorper ultrices mi platea nostra efficitur viverra. Sollicitudin imperdiet mollis maecenas fusce facilisi inceptos penatibus ultricies. Duis eleifend mollis mauris ligula risus tellus litora tortor. Elementum lobortis neque tristique hendrerit et interdum. Sociosqu facilisis sem curabitur scelerisque nullam amet sapien lobortis. Tempus eros ornare ante ligula per; sollicitudin bibendum dapibus."
                    },
                    {
                        question: "Lorem ipsum odor amet, consectetuer adipiscing elit. Aptent ullamcorper ultrices mi platea nostra efficitur viverra. Sollicitudin imperdiet mollis maecenas fusce facilisi inceptos penatibus ultricies. Duis eleifend mollis mauris ligula risus tellus litora tortor. Elementum lobortis neque tristique hendrerit et interdum. Sociosqu facilisis sem curabitur scelerisque nullam amet sapien lobortis. Tempus eros ornare ante ligula per; sollicitudin bibendum dapibus.",
                        answer: "example answer"
                    },
                    {
                        question: "Lorem ipsum odor amet, consectetuer adipiscing elit. Aptent ullamcorper ultrices mi platea nostra efficitur viverra. Sollicitudin imperdiet mollis maecenas fusce facilisi inceptos penatibus ultricies. Duis eleifend mollis mauris ligula risus tellus litora tortor. Elementum lobortis neque tristique hendrerit et interdum. Sociosqu facilisis sem curabitur scelerisque nullam amet sapien lobortis. Tempus eros ornare ante ligula per; sollicitudin bibendum dapibus.",
                        answer: "example answer"
                    },
                    {
                        answer: "example answer",
                        question: "Lorem ipsum odor amet, consectetuer adipiscing elit. Aptent ullamcorper ultrices mi platea nostra efficitur viverra. Sollicitudin imperdiet mollis maecenas fusce facilisi inceptos penatibus ultricies. Duis eleifend mollis mauris ligula risus tellus litora tortor. Elementum lobortis neque tristique hendrerit et interdum. Sociosqu facilisis sem curabitur scelerisque nullam amet sapien lobortis. Tempus eros ornare ante ligula per; sollicitudin bibendum dapibus.",
                    },
                ]
            };
            yield promises_1.default.writeFile(path.join(this.question_dir, question_file_name), JSON.stringify(questions));
            return question_file_name;
        });
    }
    getQuestions(questions_file) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield promises_1.default.readFile(path.join(this.question_dir, questions_file), "utf-8");
            return JSON.parse(content);
        });
    }
}
exports.MockSarapeAi = MockSarapeAi;
//# sourceMappingURL=MockSarapeAi.js.map