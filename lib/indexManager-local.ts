/* Handles indexing and retrieval */

import {
  VectorStoreIndex,
  storageContextFromDefaults,
  Document,
} from 'llamaindex';
import path from 'path';

export async function createIndex(documents: Document[]) {
  // console.log('📄 Debugging Documents Before Indexing:');
  // documents.forEach((doc, index) => {
  //   console.log(
  //     `📘 Document ${index + 1} Metadata:`,
  //     JSON.stringify(doc.metadata, null, 2)
  //   );
  // });

  const storagePath = path.join(process.cwd(), 'storage');
  const storageContext = await storageContextFromDefaults({
    persistDir: storagePath,
  });

  return await VectorStoreIndex.fromDocuments(documents, { storageContext });
}
