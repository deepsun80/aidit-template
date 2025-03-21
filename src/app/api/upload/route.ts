import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { LlamaParseReader, Document } from 'llamaindex';
import { extractAuditQuestions } from '@lib/llmProcessor';
import { formatError } from '@lib/helpers';

// Define a temporary storage path
const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp_uploads');

// Ensure the directory exists
async function ensureUploadDir() {
  try {
    await fs.mkdir(TEMP_UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Error ensuring upload directory:', error);
    throw new Error(
      `Error ensuring upload directory: ${formatError(error, String(error))}`
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Ensure the upload directory exists
    await ensureUploadDir();

    // Get form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    // -- Enable for PDF only --
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    console.log('Received file:', file.name);

    // Read the file as a buffer
    const fileBytes = await file.arrayBuffer();
    const fileBuffer = Buffer.from(fileBytes);

    // Save the uploaded file temporarily
    const filePath = path.join(TEMP_UPLOAD_DIR, file.name);
    await fs.writeFile(filePath, fileBuffer);

    console.log('File saved at:', filePath);

    // Parse document using LlamaParseReader
    const reader = new LlamaParseReader();
    const docs: Document[] = await reader.loadData(filePath);

    // console.log('docs:', docs);

    if (docs.length === 0) {
      console.warn('No content extracted from file.');
      return NextResponse.json(
        { error: 'Could not extract content from file' },
        { status: 500 }
      );
    }

    // Extract text content from parsed documents
    const extractedText = docs.map((doc) => doc.text).join('\n');
    // console.log('Extracted Text:', extractedText.substring(0, 1000)); // Log first 1000 chars

    // **Send text to LLM to extract audit questions**
    const auditQuestions = await extractAuditQuestions(extractedText);

    console.log('Audit Questions:', auditQuestions);

    // Delete the temporary file after processing
    await fs.unlink(filePath);

    return NextResponse.json({
      message: 'File processed successfully',
      //   extractedText: extractedText.substring(0, 2000), // Send first 2000 chars for debugging
      questions: auditQuestions, // Send extracted questions
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      {
        error: formatError(error, 'Error processing upload.'),
      },
      { status: 500 }
    );
  }
}
