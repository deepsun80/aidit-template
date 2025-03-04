/**
 * Extracts a potential title from the first page text.
 */
export function extractTitle(lines: string[]): string | null {
  for (let line of lines) {
    line = line.trim();
    if (!line) continue; // Skip empty lines

    // Check if explicitly labeled as "Title:"
    if (line.toLowerCase().startsWith('title:')) {
      return line.replace(/title:\s*/i, '').trim();
    }

    // Check if it's the first capitalized line (likely a title)
    if (/^[A-Z\s]+$/.test(line) && line.length > 5) {
      return line;
    }
  }
  return null; // No title found
}
