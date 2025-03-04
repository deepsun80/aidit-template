import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { loadDocuments } from '@lib/documentLoader';
import { buildQueryOptions } from '@lib/queryProcessor';
import { createIndex } from '@lib/indexManager';

export async function POST(req: NextRequest) {
  try {
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
    const documents = await loadDocuments(dataDir);

    // 2. Create index
    const index = await createIndex(documents);

    // 3. Create query engine
    const queryEngine = index.asQueryEngine();

    // 4. Perform the query
    const queryOptions = buildQueryOptions(query);
    const response = await queryEngine.query(queryOptions);

    console.log('Debugging API Response:', response.sourceNodes);

    return NextResponse.json({
      question: query,
      answer: response.message?.content || 'No answer available',
    });
  } catch (error) {
    console.error('Error processing query:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
