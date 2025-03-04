/* Loads documents from /data directory using LlamaParseReader */

import { Document, LlamaParseReader } from 'llamaindex';
import path from 'path';
import fs from 'fs';
import { extractTitle } from './helpers';

export async function loadDocuments(dataDir: string): Promise<Document[]> {
  const fileNames = fs.readdirSync(dataDir);
  const filePaths = fileNames.map((file) => path.join(dataDir, file));

  const reader = new LlamaParseReader();
  const rawDocuments: Document[] = [];
  const documentTitles: string[] = []; // Store extracted document titles

  for (const filePath of filePaths) {
    console.log(`Processing file: ${filePath}`);
    const docs = await reader.loadData(filePath);

    if (docs.length > 0) {
      // ✅ Extract title from the first document's first page
      const firstPageText = docs[0].text.split('\n').slice(0, 10); // Get top 10 lines
      const title = extractTitle(firstPageText) || 'Unknown Title';

      console.log('📄 Extracted Document Title:', title);

      // ✅ Store extracted title
      documentTitles.push(`- ${title} (${path.basename(filePath)})`);

      // ✅ Combine all chunks into a single document & assign metadata
      const documentWithMetadata = new Document({
        text: `Filename: ${path.basename(filePath)}\n\n${docs
          .map((doc) => doc.text)
          .join('\n\n')}`, // ✅ Embed filename into text to help retrieval
        metadata: {
          file_name: path.basename(filePath),
          title: title || 'Unknown Title',
        },
      });

      rawDocuments.push(documentWithMetadata);
    }
  }

  // ✅ Store the document count WITHOUT indexing it
  console.log(`📄 Total documents: ${filePaths.length}`);
  console.log('📄 Available Documents:', documentTitles.join('\n'));

  return rawDocuments; // ✅ Only return actual documents (no metadata doc)
}
