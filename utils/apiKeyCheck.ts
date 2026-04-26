type AppSettingsShape = {
  apiKeys?: {
    geminiApiKey?: string;
  };
};

let runtimeApiKey = '';

export const setRuntimeApiKey = (apiKey: string): void => {
  runtimeApiKey = apiKey.trim();
};

const readStoredApiKey = (): string => {
  if (runtimeApiKey) {
    return runtimeApiKey;
  }

  if (typeof window === 'undefined') {
    return '';
  }

  try {
    const storedSettings = window.localStorage.getItem('app_settings');
    if (!storedSettings) {
      return '';
    }

    const parsedSettings = JSON.parse(storedSettings) as AppSettingsShape;
    return parsedSettings.apiKeys?.geminiApiKey?.trim() || '';
  } catch {
    return '';
  }
};

const readEnvironmentApiKey = (): string => {
  const viteEnv = (import.meta as ImportMeta & {
    env?: Record<string, string | undefined>;
  }).env;

  return (
    viteEnv?.VITE_GEMINI_API_KEY?.trim() ||
    viteEnv?.GEMINI_API_KEY?.trim() ||
    process.env.API_KEY ||
    process.env.GEMINI_API_KEY ||
    ''
  );
};

export const getConfiguredApiKey = (): string => {
  return readStoredApiKey() || readEnvironmentApiKey();
};

export const hasApiKey = (): boolean => {
  return !!getConfiguredApiKey();
};

export const getApiKeyOrThrow = (): string => {
  const key = getConfiguredApiKey();
  if (!key) {
    throw new Error('API key not configured');
  }
  return key;
};
