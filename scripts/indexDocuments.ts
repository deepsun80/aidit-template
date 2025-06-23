/**
 * Script to fetch documents from Google Drive and store them in Pinecone.
 *
 * - Fetches files from a specified Google Drive folder.
 * - Downloads and processes file contents.
 * - Converts documents into vector embeddings.
 * - Stores the vectorized documents in Pinecone for retrieval.
 */

import {
  OpenAIEmbedding,
  VectorStoreIndex,
  Document,
  Settings,
  storageContextFromDefaults,
} from 'llamaindex';
import { PineconeVectorStore } from '@llamaindex/pinecone';
// import { fetchGoogleDriveFiles } from '@lib/googleDrive';
import { loadDocuments } from '@lib/documentLoader';
import { formatError } from '@lib/helpers';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' }); // Load environment variables

// Set OpenAI Embedding Model
Settings.embedModel = new OpenAIEmbedding();

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME!;
const PINECONE_NAMESPACE = process.env.PINECONE_NAMESPACE || 'default';

async function indexDocuments() {
  try {
    console.log('Fetching files from Google Drive...');
    const documents: Document[] = await loadDocuments();

    if (documents.length === 0) {
      console.log('No documents found to index.');
      return;
    }

    console.log(
      `Indexing ${documents.length} documents into Pinecone namespace: ${process.env.PINECONE_NAMESPACE}...`
    );

    // Initialize Pinecone Vector Store
    const pineconeVectorStore = new PineconeVectorStore({
      indexName: PINECONE_INDEX_NAME,
      namespace: PINECONE_NAMESPACE,
    });

    // Use Pinecone as the storage context
    const storageContext = await storageContextFromDefaults({
      vectorStore: pineconeVectorStore,
    });

    // Index New Documents into Pinecone
    await VectorStoreIndex.fromDocuments(documents, { storageContext });

    console.log('Documents successfully indexed in Pinecone.');
  } catch (error) {
    console.error('Error indexing documents:', error);
    throw new Error(
      `Error indexing documents: ${formatError(error, String(error))}`
    );
  }
}

// Run script
indexDocuments();
