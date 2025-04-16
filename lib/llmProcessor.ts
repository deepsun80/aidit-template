import { OpenAI } from 'openai';
import { formatError } from '@lib/helpers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/** Extracts audit-related questions and standard references in a structured format */
export async function extractAuditQuestions(
  text: string
): Promise<{ question: string; reference: string }[]> {
  const prompt = `You are an assistant that extracts audit-related audit questions and their corresponding Standard References from a tabular document.

  Instructions:
  - Extract all complete audit-related questions from the **Audit Topic** column.
  - For each question, also extract the **Standard Reference** from the same row (usually ISO or CFR numbers).
  - If a question does not have a **Standard Reference**, include the question without any standard reference on the item.
  - If a row has multiple complete questions, include each question with the same reference.
  - Do NOT include broken phrases like "Procedure?" or "Available?" unless part of a full sentence.
  - Format the output as a JSON array of objects with \`question\` and \`reference\` fields. Example:

  [
    { "question": "Is a procedure established for reviewing complaints?", "reference": "ISO 4.1, CFR §820.198" },
    { "question": "Are records of changes maintained?", "reference": "CFR §820.30(i)" },
    { "question": "Is the control of outsourced processes defined?", "reference": "ISO 4.2(d), CFR §820.50"}
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
