import { config as loadEnv } from 'dotenv';

// Load local worker env first, then fallback to default .env if present.
loadEnv({ path: '.env.local' });
loadEnv();

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';
export const GEMINI_FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || 'gemini-pro-latest';