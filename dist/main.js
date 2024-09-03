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
const PDFReader_1 = require("./PDFReader");
const AIService_1 = require("./services/AIService");
const dotenv = __importStar(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv.config();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const pdfReader = new PDFReader_1.PDFReader();
        const aiService = new AIService_1.AIService(process.env.OPENAI_API_KEY || '');
        const filePath = 'PDFfiles/sample.pdf'; // Replace with your actual PDF file path
        if (!fs_1.default.existsSync(filePath)) {
            console.error('File does not exist:', filePath);
            return;
        }
        try {
            const pdfContent = yield pdfReader.readPDF(filePath);
            // console.log('PDF Content:', pdfContent);
            const generatedText = yield aiService.getQuestions(5, pdfContent); // Generate 5 questions
            console.log('Generated Questions and Answers:', generatedText);
            saveGeneratedText(generatedText);
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}
function saveGeneratedText(text) {
    const resultDir = './results';
    if (!fs_1.default.existsSync(resultDir)) {
        fs_1.default.mkdirSync(resultDir);
    }
    const files = fs_1.default.readdirSync(resultDir);
    const resultNumber = files.filter(file => file.startsWith('result_')).length + 1;
    const resultFilePath = path_1.default.join(resultDir, `result_${resultNumber}.txt`);
    fs_1.default.writeFileSync(resultFilePath, text, 'utf8');
    console.log(`Output written to ${resultFilePath}`);
}
main();
//# sourceMappingURL=main.js.map