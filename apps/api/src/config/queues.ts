import { Queue } from 'bullmq';
import { QueueNames } from '@examina/types';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const assessmentQueue = new Queue(QueueNames.ASSESSMENTS, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

export const evaluationQueue = new Queue(QueueNames.EVALUATIONS, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

export const notificationQueue = new Queue(QueueNames.NOTIFICATIONS, {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});

export const questionGenerationQueue = new Queue(QueueNames.QUESTION_GENERATION, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 100,
  },
});

export const queues = [assessmentQueue, evaluationQueue, notificationQueue, questionGenerationQueue];

export async function closeQueues(): Promise<void> {
  await Promise.all(queues.map((queue) => queue.close()));
}
