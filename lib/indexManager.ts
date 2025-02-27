/* Handles indexing and retrieval: 
    Handles index creation and storage management.
*/
import {
  VectorStoreIndex,
  storageContextFromDefaults,
  Document,
} from 'llamaindex';
import path from 'path';

export async function createIndex(documents: Document[]) {
  const storagePath = path.join(process.cwd(), 'storage');
  const storageContext = await storageContextFromDefaults({
    persistDir: storagePath,
  });

  return await VectorStoreIndex.fromDocuments(documents, { storageContext });
}
