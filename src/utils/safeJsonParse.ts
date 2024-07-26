export const safeJsonParse = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(error, jsonString);
    return null;
  }
}
