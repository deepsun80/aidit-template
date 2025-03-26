import { OpenAI } from 'openai';
import { formatError } from '@lib/helpers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/** Extracts audit-related questions from document text in a structured format */
export async function extractAuditQuestions(text: string): Promise<string[]> {
  const prompt = `You are an assistant that extracts audit-related questions from provided documents.

Instructions:
- Only extract actual audit-related questions from the input text.
- Do NOT include statements or metadata.
- Return the output as a JSON array of strings. For example:
["Question 1", "Question 2", "Question 3"]

Here is the document text:
${text}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.3,
      max_tokens: 2500,
    });

    const content = response.choices[0].message?.content || '';

    // Try parsing the response as JSON
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed.filter((q) => typeof q === 'string');
      } else {
        throw new Error('Response was not a valid JSON array');
      }
    } catch (jsonError) {
      console.error('JSON parsing failed. Raw content:', content);
      throw new Error(
        `Failed to parse questions as JSON: ${formatError(
          jsonError,
          String(jsonError)
        )}`
      );
    }
  } catch (error) {
    console.error('Error extracting audit questions:', error);
    throw new Error(
      `Failed to extract audit questions: ${formatError(error, String(error))}`
    );
  }
}
