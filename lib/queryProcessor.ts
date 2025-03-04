/* Query handling engine */

export function buildQueryOptions(query: string) {
  return { query };
}

// export function buildQueryOptions(query: string) {
//   let modifiedQuery = query; // Start with the original query

//   // Check if the query asks for a document by title
//   const titleMatch = query.match(/document (?:titled|called) (["']?)(.*?)\1/i);
//   if (titleMatch) {
//     const requestedTitle = titleMatch[2]; // Extract the title
//     options.filters = { title: requestedTitle }; // ✅ Filter by title metadata
//     modifiedQuery += ` Only return results from a document with the exact title "${requestedTitle}". If no such document exists, respond accordingly.`;
//   }

//   // Modify query if it contains "approved by"
//   if (query.toLowerCase().includes('approved by')) {
//     modifiedQuery +=
//       ' Look for an explicit signature by the department or individual in the query.';
//   }

//   return { query: modifiedQuery }; // Pass modified query to the LLM
// }
