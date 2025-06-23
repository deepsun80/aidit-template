import * as dotenv from 'dotenv';
import { Pinecone } from '@pinecone-database/pinecone';

dotenv.config({ path: '.env.local' });

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;
const PINECONE_NAMESPACE = process.env.PINECONE_NAMESPACE || 'default';

if (!PINECONE_API_KEY || !PINECONE_INDEX_NAME) {
  throw new Error(
    'Missing Pinecone API Key or Index Name. Check your .env.local file.'
  );
}

const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
const pineconeIndex = pinecone.index(PINECONE_INDEX_NAME);

async function deleteNamespaceVectors() {
  console.log(
    `Deleting all vectors from namespace "${PINECONE_NAMESPACE}" in index "${PINECONE_INDEX_NAME}"...`
  );

  await pineconeIndex.namespace(PINECONE_NAMESPACE).deleteAll();

  console.log('Vectors deleted successfully from namespace.');
}

deleteNamespaceVectors().catch(console.error);
