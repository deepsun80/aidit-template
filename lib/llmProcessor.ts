import { OpenAI } from 'openai';
import { formatError } from '@lib/helpers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/** Extracts "Audit Topic" questions from the extracted document text */
export async function extractAuditQuestions(text: string): Promise<string[]> {
  const prompt = `
    You will be given document text that may contain audit-related questions.
    Your task is to extract and return each audit question on a new line.

    Each question may or may not contain a question mark. If a line contains multiple questions, return only the first.

    Do not return any headers, introductory text, numbers, dashes, or bullet points.

    ---

    Example Input:
    The following are sample audit considerations:
    1. What is the CAPA procedure? How is it documented?
    2. Are employees trained regularly?

    Example Output:
    What is the CAPA procedure?
    Are employees trained regularly?

    ---

    Now process the following text:

    ${text}
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'system', content: prompt }],
      max_tokens: 2500,
    });

    const extractedText = response.choices[0].message?.content || '';

    // Process extracted text into individual questions
    const questions = extractedText
      .split('\n') // Split into rows
      .map((q) => q.trim()) // Trim spaces
      .filter((q) => q.length > 0); // Remove empty lines
    //   .map((q) => q.split(/[?.!;]/)[0].trim()); // Take only the first question in each row

    return questions;
  } catch (error) {
    console.error('Error extracting audit questions:', error);
    throw new Error(
      `Failed to extract audit questions: ${formatError(error, String(error))}`
    );
  }
}
