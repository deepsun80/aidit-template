import { VectorStoreIndex, Document } from 'llamaindex';

let cachedIndex: VectorStoreIndex | null = null;

export async function createIndex(documents: Document[]) {
  // console.log('📄 Debugging Documents Before Indexing:');
  // documents.forEach((doc, index) => {
  //   console.log(
  //     `📘 Document ${index + 1} Metadata:`,
  //     JSON.stringify(doc.metadata, null, 2)
  //   );
  // });

  if (cachedIndex) {
    console.log('Using in-memory cached index');
    return cachedIndex;
  }

  console.log('Creating new in-memory index (No storage persistence)');
  cachedIndex = await VectorStoreIndex.fromDocuments(documents);

  return cachedIndex;
}
