import { NextRequest, NextResponse } from 'next/server';
import { buildQueryOptions } from '@lib/queryProcessor';
import { getIndex } from '@lib/indexManager';

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

    // 1. Create index
    const { index, error } = await getIndex();

    if (error || !index) {
      console.error('Error retrieving index:', error);
      return NextResponse.json(
        { error: 'Failed to load index. Please try again later.' },
        { status: 500 }
      );
    }

    // 2. Create query engine
    // const queryEngine = index.asQueryEngine();
    const queryEngine = index.asQueryEngine({
      similarityTopK: 10, // Number of similar documents to return
    });

    // 4. Perform the query
    const queryOptions = buildQueryOptions(query);
    const response = await queryEngine.query(queryOptions);

    // Detailed logging
    // console.log(`Final Retrieved Chunks Passed to LLM:`);
    // response.sourceNodes?.forEach((node, index) => {
    //   console.log(
    //     `📘 Retrieved Doc ${index + 1} - File: ${
    //       node.node.metadata?.file_name
    //     }, Page: ${node.node.metadata?.page || 'Unknown'}, Chunk Index: ${
    //       node.node.metadata?.chunk_index || 'Unknown'
    //     }`
    //   );
    // });

    // General logging
    console.log('Debugging API Response:', response.message?.content);

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
