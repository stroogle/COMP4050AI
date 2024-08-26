import fs from 'fs';
import pdfParse from 'pdf-parse';

export class PDFReader {
  async readPDF(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }
}