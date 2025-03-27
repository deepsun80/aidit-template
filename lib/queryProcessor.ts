/* Builds query context and filters based on metadata: 
    Handles query filtering logic.
    Builds query context to include document count.
*/

export function buildQueryOptions(query: string) {
  // return {
  //   query: `${query}. Cite the document and page for the information in response in a new paragraph after the response.`,
  // };
  return {
    query: `
      Answer the following question using only the provided documents. 
      If the answer is not found in the documents, clearly state that.

      After your answer, include:
      - A citation in a new paragraph, formatted exactly like this: 
        Cited from: Document Name, Page X
      - Another paragraph that says only: 
        Found in Context: true
      If the answer is not found in the context, do not include the citation paragraph. Instead, just include:
        Found in Context: false

      Question: ${query}
    `.trim(),
  };
}
