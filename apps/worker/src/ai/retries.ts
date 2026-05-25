export interface RetryContext {
  attempt: number;
  maxRetries: number;
  delayMs: number;
}

export class GenerationError extends Error {
  retryable: boolean;
  details?: Record<string, unknown>;

  constructor(message: string, options?: { retryable?: boolean; details?: Record<string, unknown> }) {
    super(message);
    this.name = 'GenerationError';
    this.retryable = options?.retryable ?? true;
    this.details = options?.details;
  }
}

export function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.stack ?? error.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function sleep(delayMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

export async function withGenerationRetries<T>(
  operation: (context: RetryContext) => Promise<T>,
  options?: { maxRetries?: number; baseDelayMs?: number },
): Promise<T> {
  const maxRetries = options?.maxRetries ?? 3;
  const baseDelayMs = options?.baseDelayMs ?? 600;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      const delayMs = attempt > 1 ? baseDelayMs * 2 ** (attempt - 2) : 0;

      if (delayMs > 0) {
        console.log('[Retry] attempting AI generation again:', { attempt, maxRetries, delayMs });
        await sleep(delayMs);
      }

      return await operation({ attempt, maxRetries, delayMs });
    } catch (error) {
      lastError = error;

      const retryable = !(error instanceof GenerationError) || error.retryable;
      console.error('[Retry] AI generation attempt failed:', {
        attempt,
        maxRetries,
        retryable,
        error: describeError(error),
      });

      if (!retryable || attempt === maxRetries) {
        break;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error(describeError(lastError));
}