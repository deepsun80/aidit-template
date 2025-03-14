/**
 * Loads documents from Google Drive using LlamaParseReader.
 *
 * - Fetches files from a Google Drive folder.
 * - Downloads and extracts content from each file.
 * - Saves file content temporarily and processes it.
 * - Converts extracted text into LlamaIndex Document format.
 */

import { Document, LlamaParseReader } from 'llamaindex';
import { fetchGoogleDriveFiles, downloadFileContent } from './googleDrive';
import fs from 'fs';
import path from 'path';
import os from 'os';

const MAX_FILE_SIZE_MB = 50 * 1024 * 1024; // 50MB limit

export async function loadDocuments(): Promise<Document[]> {
  const files = await fetchGoogleDriveFiles();
  if (!files.length) {
    console.log('No files found in Google Drive.');
    return [];
  }

  const reader = new LlamaParseReader();
  let rawDocuments: Document[] = [];

  for (const file of files) {
    console.log(`Processing file: ${file.name || 'Unnamed File'}`);

    // Ensure file has an ID before proceeding
    if (!file.id) {
      console.warn(`Skipping file (missing file ID)`);
      continue;
    }

    // Assign a fallback name if file.name is missing
    const safeFileName = file.name
      ? file.name.replace(/\s+/g, '_')
      : `file_${file.id}.pdf`;

    // Define a temporary file path
    const tempFilePath = path.join(os.tmpdir(), safeFileName);

    try {
      // Download file content
      const fileBuffer = await downloadFileContent(file.id);
      if (!fileBuffer) {
        console.warn(`Skipping file ${safeFileName} (empty content)`);
        continue;
      }

      // Check if file exceeds size limit
      if (fileBuffer.length > MAX_FILE_SIZE_MB) {
        console.warn(`Skipping ${safeFileName}: File is too large.`);
        continue;
      }

      // Write file content to the temp file
      fs.writeFileSync(tempFilePath, fileBuffer);

      // Parse document content using LlamaParseReader
      const docs = await reader.loadData(tempFilePath);
      rawDocuments = rawDocuments.concat(docs);

      // Clean up: Delete temp file after processing
      fs.unlinkSync(tempFilePath);
    } catch (error) {
      console.error(`Error processing file ${safeFileName}:`, error);
    }
  }

  return rawDocuments;
}
