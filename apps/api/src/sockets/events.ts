import { SocketChannels } from '@examina/types';
import type { GenerationEventPayload } from '@examina/types';

export const SOCKET_CHANNELS = SocketChannels;
export const SOCKET_EVENTS = {
  QUEUED: 'generation:queued',
  PROCESSING: 'generation:processing',
  COMPLETED: 'generation:completed',
  FAILED: 'generation:failed',
} as const;

export type GenerationSocketEvent = GenerationEventPayload;