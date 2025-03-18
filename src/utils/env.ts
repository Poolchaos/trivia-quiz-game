export function getEnvVariable(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  
  return value;
}

// Database environment variables
export const MONGODB_URI = getEnvVariable('MONGODB_URI');
export const MONGODB_DB = getEnvVariable('MONGODB_DB');

// Application environment variables
export const APP_URL = getEnvVariable('NEXT_PUBLIC_APP_URL');
export const APP_NAME = getEnvVariable('NEXT_PUBLIC_APP_NAME');

// Rate limiting environment variables (with defaults)
export const RATE_LIMIT_MAX = parseInt(getEnvVariable('RATE_LIMIT_MAX', '100'), 10);
export const RATE_LIMIT_WINDOW_MS = parseInt(getEnvVariable('RATE_LIMIT_WINDOW_MS', '60000'), 10);