declare module 'pdf-parse' {
    interface PDFParseOptions {
      version?: string;
      max?: number;
      pagerender?: (pageData: any) => Promise<any>;
      eventBus?: any;
    }
  
    interface PDFParseResult {
      numpages: number;
      numrender: number;
      info: any;
      metadata: any;
      version: string;
      text: string;
    }
  
    function pdf(dataBuffer: Buffer | Uint8Array, options?: PDFParseOptions): Promise<PDFParseResult>;
  
    export = pdf;
  }
  