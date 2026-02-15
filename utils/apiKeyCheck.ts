export const hasApiKey = (): boolean => {
  const key = process.env.API_KEY || process.env.GEMINI_API_KEY;
  return !!key && key.length > 0;
};

export const getApiKeyOrThrow = (): string => {
  const key = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('API key not configured');
  }
  return key;
};
