import {
  VectorStoreIndex,
  Document,
  OpenAIEmbedding,
  Settings,
  storageContextFromDefaults,
} from 'llamaindex';
import { PineconeVectorStore } from '@llamaindex/pinecone';
import { loadDocuments } from '../lib/documentLoader'; // Ensure this loads documents correctly
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' }); // Load environment variables

// Set OpenAI Embedding Model
Settings.embedModel = new OpenAIEmbedding();

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME!;

async function indexDocuments() {
  try {
    console.log('Loading documents from /data directory...');
    const documents: Document[] = await loadDocuments('./data');

    if (documents.length === 0) {
      console.log('No documents found to index.');
      return;
    }

    console.log(`Indexing ${documents.length} documents into Pinecone...`);

    // Initialize Pinecone Vector Store
    const pineconeVectorStore = new PineconeVectorStore({
      indexName: PINECONE_INDEX_NAME,
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
  }
}

// Run script
indexDocuments();
