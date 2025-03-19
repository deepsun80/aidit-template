/* Builds query context and filters based on metadata: 
    Handles query filtering logic.
    Builds query context to include document count.
*/

export function buildQueryOptions(query: string) {
  return {
    query: `${query}. Cite the document and page for the information in response.`,
  };
}
