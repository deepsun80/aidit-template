/**
 * Google Drive Integration:
 *
 * - Fetches a list of files from a specific Google Drive folder.
 * - Downloads file content as a Buffer (no writing to disk).
 */

import * as dotenv from 'dotenv';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import stream from 'stream';
import { formatError } from '@lib/helpers';

dotenv.config({ path: '.env.local' });

// Load environment variables
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL!;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY
  ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : '';
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID!;

// Initialize Google Drive API client
const auth = new GoogleAuth({
  credentials: {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY,
  },
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

const drive = google.drive({ version: 'v3', auth });

/** Fetches files from the specified Google Drive folder */
export async function fetchGoogleDriveFiles() {
  try {
    const response = await drive.files.list({
      q: `'${GOOGLE_DRIVE_FOLDER_ID}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, modifiedTime)',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    });

    const files = response.data.files || [];
    console.log(`Fetched ${files.length} files from Google Drive.`);

    return files;
  } catch (error) {
    console.error('Error fetching files from Google Drive:', error);
    throw new Error(
      `Error fetching files from Google Drive: ${formatError(
        error,
        String(error)
      )}`
    );
  }
}

/** Downloads a file's content as a Buffer (no disk writing) */
export async function downloadFileContent(
  fileId: string
): Promise<Buffer | null> {
  try {
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    const bufferChunks: Buffer[] = [];
    const bufferStream = new stream.Writable({
      write(chunk, encoding, callback) {
        bufferChunks.push(Buffer.from(chunk));
        callback();
      },
    });

    await new Promise((resolve, reject) => {
      response.data
        .pipe(bufferStream)
        .on('finish', resolve)
        .on('error', reject);
    });

    return Buffer.concat(bufferChunks);
  } catch (error) {
    console.error(`Error downloading file content (ID: ${fileId}):`, error);
    throw new Error(
      `Error downloading file content (ID: ${fileId}): ${formatError(
        error,
        String(error)
      )}`
    );
  }
}
