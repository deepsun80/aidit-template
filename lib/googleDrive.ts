import * as dotenv from 'dotenv';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

dotenv.config({ path: '.env.local' });

// Load environment variables
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL!;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY
  ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : '';
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID!;

// console.log('GOOGLE_CLIENT_EMAIL:', GOOGLE_CLIENT_EMAIL);
// console.log('GOOGLE_PRIVATE_KEY:', GOOGLE_PRIVATE_KEY ? 'Loaded' : 'Missing');
// console.log('GOOGLE_DRIVE_FOLDER_ID:', process.env.GOOGLE_DRIVE_FOLDER_ID);

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

    return response.data.files || [];
  } catch (error) {
    console.error('Error fetching files from Google Drive:', error);
    return error;
  }
}
