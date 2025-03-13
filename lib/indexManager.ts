import {
  VectorStoreIndex,
  Document,
  OpenAIEmbedding,
  Settings,
  storageContextFromDefaults,
} from 'llamaindex';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeVectorStore } from '@llamaindex/pinecone';

// Set OpenAI Embedding Model
Settings.embedModel = new OpenAIEmbedding();
// console.log('Embed Model Set:', Settings.embedModel);

const PINECONE_API_KEY = process.env.PINECONE_API_KEY!;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME!;

// Initialize Pinecone client
const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
const pineconeIndex = pinecone.index(PINECONE_INDEX_NAME);

// Function to wait until Pinecone confirms vectors exist
async function waitForPineconeIndex(expectedCount: number, retries = 5) {
  for (let i = 0; i < retries; i++) {
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
    const indexStats = await pineconeIndex.describeIndexStats();
    const vectorCount = indexStats.totalRecordCount || 0;

    console.log(`Pinecone Vector Count Check: ${vectorCount}/${expectedCount}`);
    if (vectorCount >= expectedCount) {
      console.log('Pinecone has successfully indexed all documents.');
      return;
    }
  }
  console.warn('Pinecone may not have indexed all documents yet.');
}

export async function createIndex(documents: Document[]) {
  console.log('Checking Pinecone for existing index...');

  // Connect to Pinecone Vector Store
  const pineconeVectorStore = new PineconeVectorStore({
    indexName: PINECONE_INDEX_NAME,
  });

  // Step 1: Check if Pinecone already has vectors using .stats()
  const indexStats = await pineconeIndex.describeIndexStats();
  const vectorCount = indexStats.totalRecordCount || 0;

  if (vectorCount > 0) {
    console.log('Existing vectors found. Loading index from Pinecone...');
    return await VectorStoreIndex.fromVectorStore(pineconeVectorStore);
  } else {
    console.log('No existing vectors found. Creating new index...');

    // Debug: Ensure Documents Exist Before Indexing
    console.log('Total Documents to Index:', documents.length);
    if (documents.length === 0) {
      console.warn(
        'No documents to index! Ensure documents are loaded properly.'
      );
    }

    // Use Pinecone as the storage context
    const storageContext = await storageContextFromDefaults({
      vectorStore: pineconeVectorStore,
    });

    // Index New Documents into Pinecone
    await VectorStoreIndex.fromDocuments(documents, { storageContext });

    console.log('Waiting for Pinecone to confirm document ingestion...');
    await waitForPineconeIndex(documents.length * 10); // Adjusting expected count based on chunking

    console.log('Now reloading index from Pinecone...');
    return await VectorStoreIndex.fromVectorStore(pineconeVectorStore);
  }
}
