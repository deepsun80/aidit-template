/* Builds query context and filters based on metadata: 
    Handles query filtering logic.
    Builds query context to include document count.
*/
/* eslint-disable @typescript-eslint/no-explicit-any */

export function buildQueryOptions(query: string) {
  const signatureKeywords = ['approved by', 'signed by', 'authorized by'];
  const options: any = { query };

  // If the query includes approval-related terms, filter only documents with signatures
  if (
    signatureKeywords.some((keyword) => query.toLowerCase().includes(keyword))
  ) {
    options.filters = { containsSignature: true };
  }

  return options;
}

export function buildQueryWithContext(
  query: string,
  totalDocs: number,
  documentNames: string
) {
  return `There are ${totalDocs} documents in the system. The available documents are: ${documentNames}.\n\nUser question: ${query}`;
}
