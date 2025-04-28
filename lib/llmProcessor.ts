import { OpenAI } from 'openai';
import { formatError } from '@lib/helpers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/** Extracts audit-related questions and standard references in a structured format */
export async function extractAuditQuestions(
  text: string
): Promise<{ question: string; reference: string }[]> {
  const prompt = `You are an assistant that extracts audit-related questions and their corresponding Standard References from a tabular document.

  Instructions:
  - Always extract all complete audit-related questions from the **Audit Topic** column.
  - For each question:
    - If a **Standard Reference** is present in the same row (such as ISO or CFR numbers), include it.
    - If there is **no Standard Reference**, still include the question and set the \`reference\` field to an empty string ("").
  - Do NOT skip any complete questions, even if the Standard Reference is missing.
  - Do NOT include incomplete phrases like "Procedure?" or "Available?" unless they are part of a full sentence.
  - Format the output as a JSON array of objects with the following structure:
  [
    { "question": "Full question text here", "reference": "ISO 4.1, CFR §820.198" },
    { "question": "Another question here", "reference": "" }
  ]

  Document text:
  ${text}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.3,
      max_tokens: 2500,
    });

    const content = response.choices[0].message?.content || '';

    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item) =>
            typeof item === 'object' &&
            typeof item.question === 'string' &&
            typeof item.reference === 'string'
        );
      } else {
        throw new Error('Response was not a valid JSON array of objects');
      }
    } catch (jsonError) {
      console.error('JSON parsing failed. Raw content:', content);
      throw new Error(
        `Failed to parse structured question objects: ${formatError(
          jsonError,
          String(jsonError)
        )}`
      );
    }
  } catch (error) {
    console.error('Error extracting structured audit questions:', error);
    throw new Error(
      `Failed to extract audit questions: ${formatError(error, String(error))}`
    );
  }
}
