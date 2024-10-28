"use strict";
// import { PDFReader } from './PDFReader';
// import { AIService } from './services/AIService';
// import * as dotenv from 'dotenv';
// import fs from 'fs';
// import path from 'path';
// // Make the file a module by adding export {}
// export {};
// dotenv.config();
// async function main() {
//   const pdfReader = new PDFReader();
//   const aiService = new AIService(process.env.OPENAI_API_KEY || '');
//   const filePath = 'PDFfiles/sample.pdf'; // Replace with your actual PDF file path
//   if (!fs.existsSync(filePath)) {
//     console.error('File does not exist:', filePath);
//     return;
//   }
//   try {
//     const pdfContent = await pdfReader.readPDF(filePath);
//    // console.log('PDF Content:', pdfContent);
//     const generatedText = await aiService.getQuestions(5, pdfContent); // Generate 5 questions
//     console.log('Generated Questions and Answers:', generatedText);
//     saveGeneratedText(generatedText);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }
// function saveGeneratedText(text: string) {
//   const resultDir = './results';
//   if (!fs.existsSync(resultDir)) {
//     fs.mkdirSync(resultDir);
//   }
//   const files = fs.readdirSync(resultDir);
//   const resultNumber = files.filter(file => file.startsWith('result_')).length + 1;
//   const resultFilePath = path.join(resultDir, `result_${resultNumber}.txt`);
//   fs.writeFileSync(resultFilePath, text, 'utf8');
//   console.log(`Output written to ${resultFilePath}`);
// }
// main();
//# sourceMappingURL=main.js.map