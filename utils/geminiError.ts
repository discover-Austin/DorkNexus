const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return '';
  }
};

export const isInvalidGeminiApiKeyError = (error: unknown): boolean => {
  const message = getErrorMessage(error).toLowerCase();

  return [
    'api key not valid',
    'invalid api key',
    'invalid argument',
    'api_key_invalid',
    'permission denied',
    'unauthenticated',
    'unauthorized',
    'forbidden',
    'credential',
  ].some((fragment) => message.includes(fragment));
};

export const getGeminiErrorMessage = (error: unknown, fallback: string): string => {
  const message = getErrorMessage(error).toLowerCase();

  if (isInvalidGeminiApiKeyError(error)) {
    return 'The configured Gemini API key was rejected. Please update it in Settings and try again.';
  }

  if (message.includes('model') && message.includes('not found')) {
    return 'The configured Gemini model is unavailable right now. Please try again after updating the app.';
  }

  return fallback;
};
