import { VectorStoreIndex, Settings, OpenAIEmbedding } from 'llamaindex';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeVectorStore } from '@llamaindex/pinecone';
import { formatError } from '@lib/helpers';

// Set OpenAI Embedding Model
Settings.embedModel = new OpenAIEmbedding();

const PINECONE_API_KEY = process.env.PINECONE_API_KEY!;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME!;

// Initialize Pinecone client
const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
const pineconeIndex = pinecone.index(PINECONE_INDEX_NAME);

export async function getIndex() {
  try {
    console.log('Checking Pinecone for existing index...');

    // Connect to Pinecone Vector Store
    const pineconeVectorStore = new PineconeVectorStore({
      indexName: PINECONE_INDEX_NAME,
    });

    // Check if Pinecone already has vectors
    const indexStats = await pineconeIndex.describeIndexStats();
    const vectorCount = indexStats.totalRecordCount || 0;

    if (vectorCount === 0) {
      console.warn('No indexed documents found in Pinecone.');
      return {
        error: 'No indexed documents found. Please run indexing first.',
      };
    }

    console.log('Loading existing index from Pinecone...');
    return {
      index: await VectorStoreIndex.fromVectorStore(pineconeVectorStore),
    };
  } catch (error) {
    console.error('Error loading index from Pinecone:', error);
    throw new Error(
      `Failed to load index from Pinecone: ${formatError(error, String(error))}`
    );
  }
}
