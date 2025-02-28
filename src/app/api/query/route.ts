import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { loadDocuments } from '@lib/documentLoader';
import { buildQueryOptions, buildQueryWithContext } from '@lib/queryProcessor';
import { createIndex } from '@lib/indexManager';

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request
    const body = await req.json();
    const query = body?.query?.trim();

    if (!query) {
      return NextResponse.json(
        { error: 'Query cannot be empty.' },
        { status: 400 }
      );
    }

    console.log('Query received:', query);

    // 1. Load documents
    const dataDir = path.join(process.cwd(), 'data');
    const groupedDocuments = await loadDocuments(dataDir);

    const totalDocs = groupedDocuments.length;
    const documentNames = groupedDocuments
      .map((doc) => doc.metadata.file_name)
      .join(', ');

    console.log(`Total unique documents: ${totalDocs}`);
    console.log(`Available documents: ${documentNames}`);

    // 2. Create index
    const index = await createIndex(groupedDocuments);

    // 3. Create query engine
    const queryEngine = index.asQueryEngine();

    // 4. Build query options
    const queryOptions = buildQueryOptions(query);

    // 5. Modify query to include document count
    queryOptions.query = buildQueryWithContext(query, totalDocs, documentNames);

    // 6. Perform the filtered query
    const response = await queryEngine.query(queryOptions);
    console.log('Debugging API Response:', response.message?.content);

    return NextResponse.json({
      question: query, // Send back the original question
      answer: response.message?.content || 'No answer available', // Ensure message exists
    });
  } catch (error) {
    console.error('Error processing query:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
