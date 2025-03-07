import {
  VectorStoreIndex,
  Document,
  storageContextFromDefaults,
} from 'llamaindex';
import { put, head } from '@vercel/blob';
import path from 'path';
import fs from 'fs';

const BLOB_INDEX_PATH = 'storage/index.json'; // Path inside Vercel Blob
const LOCAL_STORAGE_PATH = path.join(process.cwd(), 'storage'); // Local storage path

export async function createIndex(documents: Document[]) {
  let index: VectorStoreIndex;

  if (process.env.VERCEL_ENV) {
    // Running on Vercel - Use Blob Storage
    try {
      const existingIndex = await head(BLOB_INDEX_PATH);
      if (existingIndex) {
        console.log('Loading existing index from Blob Storage...');

        // Restore storage context
        const storageContext = await storageContextFromDefaults({
          persistDir: '/tmp', // Temporary storage for Vercel runtime
        });

        index = await VectorStoreIndex.init({ storageContext });

        console.log('Successfully loaded index from Blob Storage.');
      } else {
        console.log('No existing index found, creating a new one...');
        const storageContext = await storageContextFromDefaults({
          persistDir: '/tmp',
        });
        index = await VectorStoreIndex.fromDocuments(documents, {
          storageContext,
        });

        // Save new index to Blob
        await put(BLOB_INDEX_PATH, JSON.stringify(index), {
          access: 'public',
        });

        console.log('New index created and stored in Blob Storage.');
      }
    } catch (error) {
      console.warn(
        'Failed to load existing index from Blob. Creating new one...',
        error
      );

      const storageContext = await storageContextFromDefaults({
        persistDir: '/tmp',
      });
      index = await VectorStoreIndex.fromDocuments(documents, {
        storageContext,
      });

      // Save new index to Blob
      await put(BLOB_INDEX_PATH, JSON.stringify(index), {
        access: 'public',
      });

      console.log('Fallback: New index created and stored in Blob.');
    }
  } else {
    // Running Locally - Use Local Storage
    console.log('Running locally - Storing index in local /storage');
    const storageContext = await storageContextFromDefaults({
      persistDir: LOCAL_STORAGE_PATH,
    });

    index = await VectorStoreIndex.fromDocuments(documents, { storageContext });

    // Save index locally
    fs.writeFileSync(
      path.join(LOCAL_STORAGE_PATH, 'index.json'),
      JSON.stringify(index)
    );

    console.log('Index stored locally in /storage.');
  }

  return index;
}
