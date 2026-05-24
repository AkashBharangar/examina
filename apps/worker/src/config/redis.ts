import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(REDIS_URL, {
  enableReadyCheck: true,
  enableOfflineQueue: true,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on('connect', () => {
  console.log('✓ Worker Redis connected');
});

redis.on('error', (error) => {
  console.error('✗ Worker Redis error:', error);
});

export async function disconnectRedis(): Promise<void> {
  await redis.quit();
}