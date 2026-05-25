import './config/env';
import { Worker } from 'bullmq';
import { QueueNames } from '@examina/types';
import { connectMongoDB, disconnectMongoDB } from './config/mongodb';
import { disconnectRedis } from './config/redis';
import {
  processAssessment,
  processEvaluation,
  processNotification,
} from './processors/placeholder';
import { processQuestionGeneration } from './processors/questionGeneration';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

function attachWorkerDebugEvents(worker: Worker, queueName: string): void {
  worker.on('active', (job) => {
    console.log('[BullMQ] active:', {
      queue: queueName,
      jobId: job.id,
      jobName: job.name,
      payload: job.data,
    });
  });

  worker.on('completed', (job) => {
    console.log('[BullMQ] completed:', {
      queue: queueName,
      jobId: job.id,
      jobName: job.name,
    });
  });

  worker.on('failed', (job, error) => {
    console.error('[BullMQ] failed:', {
      queue: queueName,
      jobId: job?.id,
      jobName: job?.name,
      error: error.message,
    });
  });

  worker.on('error', (error) => {
    console.error('[BullMQ] worker error:', {
      queue: queueName,
      error: error.message,
    });
  });

  worker.on('stalled', (jobId) => {
    console.error('[BullMQ] stalled:', {
      queue: queueName,
      jobId,
    });
  });
}

async function startWorkers(): Promise<void> {
  console.log('[Worker Registration] starting worker bootstrap');
  console.log('[Worker Registration] redis connection config:', connection);
  console.log('[Worker Registration] queue name constants:', QueueNames);

  await connectMongoDB();

  const assessmentWorker = new Worker(QueueNames.ASSESSMENTS, processAssessment, {
    connection,
  });
  console.log('[Worker Registration] assessment worker registered:', QueueNames.ASSESSMENTS);

  const evaluationWorker = new Worker(QueueNames.EVALUATIONS, processEvaluation, {
    connection,
  });
  console.log('[Worker Registration] evaluation worker registered:', QueueNames.EVALUATIONS);

  const notificationWorker = new Worker(QueueNames.NOTIFICATIONS, processNotification, {
    connection,
  });
  console.log('[Worker Registration] notification worker registered:', QueueNames.NOTIFICATIONS);

  const questionGenerationWorker = new Worker(QueueNames.QUESTION_GENERATION, processQuestionGeneration, {
    connection,
  });
  console.log('[Worker Registration] question worker registered:', QueueNames.QUESTION_GENERATION);

  attachWorkerDebugEvents(assessmentWorker, QueueNames.ASSESSMENTS);
  attachWorkerDebugEvents(evaluationWorker, QueueNames.EVALUATIONS);
  attachWorkerDebugEvents(notificationWorker, QueueNames.NOTIFICATIONS);
  attachWorkerDebugEvents(questionGenerationWorker, QueueNames.QUESTION_GENERATION);

  console.log('✓ Workers started and listening for jobs');

  async function shutdown(): Promise<void> {
    console.log('Shutting down workers gracefully...');
    await assessmentWorker.close();
    await evaluationWorker.close();
    await notificationWorker.close();
    await questionGenerationWorker.close();
    await disconnectRedis();
    await disconnectMongoDB();
    process.exit(0);
  }

  process.on('SIGINT', () => {
    void shutdown();
  });
  process.on('SIGTERM', () => {
    void shutdown();
  });
}

startWorkers().catch((error) => {
  console.error('Failed to start workers:', error);
  process.exit(1);
});
