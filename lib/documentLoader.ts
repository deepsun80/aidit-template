/* Loads documents from /data directory using LlamaParseReader */

import { Document, LlamaParseReader } from 'llamaindex';
import path from 'path';
import fs from 'fs';

export async function loadDocuments(dataDir: string): Promise<Document[]> {
  const fileNames = fs.readdirSync(dataDir);
  const filePaths = fileNames.map((file) => path.join(dataDir, file));

  const reader = new LlamaParseReader();
  let rawDocuments: Document[] = [];

  for (const filePath of filePaths) {
    console.log(`📄 Processing file: ${filePath}`);
    const docs = await reader.loadData(filePath);
    rawDocuments = rawDocuments.concat(docs);
  }

  return rawDocuments;
}
