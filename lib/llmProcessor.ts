import { OpenAI } from 'openai';
import { formatError } from '@lib/helpers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Helper: Split long text into chunks based on character count (~16,000 chars ≈ 4000 tokens)
function splitIntoChunks(text: string, chunkSize = 14000): string[] {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

const basePrompt = `Extract all audit-related questions from the provided document text. 
The questions may or may not have a question mark. 
Return each question as a separate line without any numbering, dashes, or bullet points.
Do not include any introductory text, just the questions themselves.
If there are multiple questions in one item, only return the first question.`;

// const oldPrompt = `
//     You will be given document text that may contain audit-related questions.
//     Your task is to extract and return each audit question on a new line.

//     Each question may or may not contain a question mark. If a line contains multiple questions, return only the first.

//     Do not return any headers, introductory text, numbers, dashes, or bullet points.

//     ---

//     Example Input:
//     The following are sample audit considerations:
//     1. What is the CAPA procedure? How is it documented?
//     2. Are employees trained regularly?

//     Example Output:
//     What is the CAPA procedure?
//     Are employees trained regularly?

//     ---

//     Now process the following text:

//     ${chunk}
//   `;

/** Extracts "Audit Topic" questions from the extracted document text */
export async function extractAuditQuestions(text: string): Promise<string[]> {
  const chunks = splitIntoChunks(text); // Split into word chunks
  let allQuestions: string[] = [];

  try {
    for (const chunk of chunks) {
      const prompt = `${basePrompt}\n\nDocument Text:\n${chunk}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [{ role: 'system', content: prompt }],
        max_tokens: 2000,
      });

      const extractedText = response.choices[0].message?.content || '';
      const questions = extractedText
        .split('\n')
        .map((q) => q.trim())
        .filter((q) => q.length > 0);

      allQuestions = [...allQuestions, ...questions];

      // console.log(`Chunk ${chunk + 1} / ${chunks.length}`);
      // console.log(`Chunk length (chars):`, chunk.length);
      // console.log(
      //   `Extracted Questions from Chunk ${chunk + 1}:`,
      //   questions.length
      // );
    }

    // Deduplicate by normalizing text (trim, lowercase)
    const uniqueQuestions = Array.from(
      new Set(allQuestions.map((q) => q.trim().toLowerCase()))
    );

    // Restore original casing from the first occurrence
    const finalQuestions: string[] = [];
    uniqueQuestions.forEach((uq) => {
      const original = allQuestions.find((q) => q.trim().toLowerCase() === uq);
      if (original) finalQuestions.push(original.trim());
    });

    // console.log(
    //   'Total extracted questions before deduplication:',
    //   allQuestions.length
    // );
    // console.log('Final deduplicated questions:', finalQuestions.length);

    return finalQuestions;
  } catch (error) {
    console.error('Error extracting audit questions:', error);
    throw new Error(
      `Failed to extract audit questions: ${formatError(error, String(error))}`
    );
  }
}
