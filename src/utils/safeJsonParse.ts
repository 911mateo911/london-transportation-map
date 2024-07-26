export function safeJsonParse<T extends object>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(error, jsonString);
    return null;
  }
}
