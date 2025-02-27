/* Loads and groups documents: 
    Handles document loading, metadata extraction, and grouping chunks. 
*/
/* eslint-disable @typescript-eslint/no-explicit-any */

import { SimpleDirectoryReader } from '@llamaindex/readers/directory';
import { Document } from 'llamaindex';

const signatureKeywords = ['approved by', 'signed by', 'authorized by'];

export async function loadDocuments(dataDir: string): Promise<Document[]> {
  // Load documents normally without extractMetadata
  const rawDocuments = await new SimpleDirectoryReader().loadData({
    directoryPath: dataDir,
    // extractMetadata: (text: any) => {
    //   const containsSignature = signatureKeywords.some((keyword) =>
    //     text.toLowerCase().includes(keyword)
    //   );
    //   return { containsSignature };
    // },
  });

  // Manually apply metadata extraction AFTER loading the documents
  const processedDocuments = rawDocuments.map((doc) => {
    const containsSignature = signatureKeywords.some((keyword) =>
      doc.text.toLowerCase().includes(keyword)
    );

    return new Document({
      text: doc.text, // Keep original text
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
