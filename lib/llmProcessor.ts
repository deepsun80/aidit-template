import { OpenAI } from 'openai';
import { formatError } from '@lib/helpers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/** Extracts "Audit Topic" questions from the extracted document text */
export async function extractAuditQuestions(text: string): Promise<string[]> {
  const prompt = `Extract all audit-related questions from the provided document text. 
    The questions may or may not have a question mark. 
    Return each question as a separate line without any numbering, dashes, or bullet points.
    Do not include any introductory text, just the questions themselves.
    If there are multiple questions in one item, only return the first question.
    \n\nDocument Text:\n${text}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'system', content: prompt }],
      max_tokens: 2000,
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
