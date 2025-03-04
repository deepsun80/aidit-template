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
    const queryEngine = index.asQueryEngine({ similarityTopK: 5 }); // Force retrieval of top 5 unique matches

    // 4. Perform the query
    const queryOptions = buildQueryOptions(query);
    const response = await queryEngine.query(queryOptions);

    // Filter out the metadata document from retrieved source nodes
    const filteredSourceNodes = response.sourceNodes?.filter(
      (node) => node.node.metadata?.type !== 'metadata'
    );

    console.log('📄 Retrieved Documents for Query (after filtering):');
    filteredSourceNodes?.forEach((node, index) => {
      console.log(
        `📘 Retrieved Doc ${index + 1} Metadata:`,
        JSON.stringify(node.node.metadata, null, 2)
      );
    });

    return NextResponse.json({
      question: query,
      answer: response.message?.content || 'No answer available',
      documents: filteredSourceNodes?.map((node) => ({
        title: node.node.metadata?.title || 'Unknown Title',
        fileName: node.node.metadata?.file_name || 'Unknown File',
      })),
    });
  } catch (error) {
    console.error('Error processing query:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
