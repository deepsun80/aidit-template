/* Loads and groups documents: 
    Handles document loading, metadata extraction, and grouping chunks. 
*/
/* eslint-disable @typescript-eslint/no-explicit-any */

// import { SimpleDirectoryReader } from '@llamaindex/readers/directory';
import { Document, LlamaParseReader } from 'llamaindex';
import path from 'path';
import fs from 'fs';

const signatureKeywords = ['approved by', 'signed by', 'authorized by'];

export async function loadDocuments(dataDir: string): Promise<Document[]> {
  // ✅ Read all files inside the /data directory
  const fileNames = fs.readdirSync(dataDir);
  const filePaths = fileNames.map((file) => path.join(dataDir, file));

  // Load documents normally without extractMetadata
  // --deprecated (if using SimpleDirectoryReader) --
  // const rawDocuments = await new SimpleDirectoryReader().loadData(dataDir);

  // Initialize LlamaParseReader (configuring it to return Markdown for structured parsing)
  const reader = new LlamaParseReader({ resultType: 'markdown' });

  //   const rawDocuments = await reader.loadData(dataDir);
  // Load documents one by one
  let rawDocuments: Document[] = [];
  for (const filePath of filePaths) {
    console.log(`Processing file: ${filePath}`);
    const docs = await reader.loadData(filePath);
    rawDocuments = rawDocuments.concat(docs);
  }

  // Manually apply metadata extraction AFTER loading the documents
  const processedDocuments = rawDocuments.map((doc) => {
    const containsSignature = signatureKeywords.some((keyword) =>
      doc.text.toLowerCase().includes(keyword)
    );

    return new Document({
      text: `Filename: ${doc.metadata?.file_name || 'unknown'}\n\n${doc.text}`, // Keep original text
      metadata: {
        file_name: doc.metadata?.file_name || 'unknown',
        containsSignature, // Store extracted metadata
      },
    });
  });

  // Group chunks by file name
  const docGroups: { [key: string]: any[] } = {};
  processedDocuments.forEach((doc) => {
    const fileName = doc.metadata?.file_name || 'unknown';
    if (!docGroups[fileName]) {
      docGroups[fileName] = [];
    }
    docGroups[fileName].push(doc);
  });

  // Convert grouped chunks into full documents with metadata
  return Object.entries(docGroups).map(([fileName, chunks]) => {
    return new Document({
      text: `Filename: ${fileName}\n\n${chunks
        .map((chunk) => chunk.text)
        .join('\n\n')}`,
      metadata: {
        file_name: fileName,
        containsSignature: chunks.some(
          (chunk) => chunk.metadata?.containsSignature
        ),
      },
    });
  });
}
