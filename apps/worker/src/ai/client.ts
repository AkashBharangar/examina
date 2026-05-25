import { GoogleGenerativeAI } from '@google/generative-ai';
import { GenerationError } from './retries';
import { GEMINI_FALLBACK_MODEL, GEMINI_MODEL } from '../config/env';

let geminiClient: GoogleGenerativeAI | null = null;
let geminiModelLogged = false;

export function getGeminiModel(): string {
  const model = GEMINI_MODEL;

  if (!geminiModelLogged) {
    console.log('[Gemini] using model:', model);
    geminiModelLogged = true;
  }

  return model;
}

function isModelNotFoundError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const message = error.message.toLowerCase();
  return message.includes('not found') && message.includes('models/');
}

function extractJsonFromText(rawText: string): string {
  const trimmed = rawText.trim();

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

export function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new GenerationError('GEMINI_API_KEY is required for AI generation', { retryable: false });
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(apiKey);
  }

  return geminiClient;
}

export async function generatePaperWithGemini(prompt: string): Promise<unknown> {
  const client = getGeminiClient();
  const configuredModel = getGeminiModel();
  const model = client.getGenerativeModel({ model: configuredModel });

  console.log('[Gemini] generating structured paper with model:', configuredModel);

  let rawText = '';

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    rawText = result.response.text();
  } catch (error) {
    if (!isModelNotFoundError(error) || configuredModel === GEMINI_FALLBACK_MODEL) {
      throw error;
    }

    console.error('[Gemini] configured model unavailable, falling back:', {
      from: configuredModel,
      to: GEMINI_FALLBACK_MODEL,
      error: error instanceof Error ? error.message : String(error),
    });

    const fallbackModel = client.getGenerativeModel({ model: GEMINI_FALLBACK_MODEL });
    const fallbackResult = await fallbackModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    rawText = fallbackResult.response.text();
  }

  if (!rawText?.trim()) {
    throw new GenerationError('Gemini returned an empty response');
  }

  const jsonPayload = extractJsonFromText(rawText);
  console.log('[Gemini] raw response cleaned for JSON parsing');

  try {
    return JSON.parse(jsonPayload) as unknown;
  } catch (error) {
    console.error('[Gemini] JSON parse failed:', { rawText, jsonPayload });
    throw new GenerationError(
      `Gemini returned malformed JSON: ${error instanceof Error ? error.message : 'Unknown parse error'}`,
    );
  }
}