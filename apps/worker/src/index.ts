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

async function startWorkers(): Promise<void> {
  await connectMongoDB();

  const assessmentWorker = new Worker(QueueNames.ASSESSMENTS, processAssessment, {
    connection,
  });

  const evaluationWorker = new Worker(QueueNames.EVALUATIONS, processEvaluation, {
    connection,
  });

  const notificationWorker = new Worker(QueueNames.NOTIFICATIONS, processNotification, {
    connection,
  });

  const questionGenerationWorker = new Worker(QueueNames.QUESTION_GENERATION, processQuestionGeneration, {
    connection,
  });

  assessmentWorker.on('completed', (job) => {
    console.log(`✓ Assessment job ${job.id} completed`);
  });

  assessmentWorker.on('failed', (job, error) => {
    console.error(`✗ Assessment job ${job?.id} failed:`, error.message);
  });

  evaluationWorker.on('completed', (job) => {
    console.log(`✓ Evaluation job ${job.id} completed`);
  });

  evaluationWorker.on('failed', (job, error) => {
    console.error(`✗ Evaluation job ${job?.id} failed:`, error.message);
  });

  notificationWorker.on('completed', (job) => {
    console.log(`✓ Notification job ${job.id} completed`);
  });

  notificationWorker.on('failed', (job, error) => {
    console.error(`✗ Notification job ${job?.id} failed:`, error.message);
  });

  questionGenerationWorker.on('active', (job) => {
    console.log(`✓ Question generation job ${job.id} processing`);
  });

  questionGenerationWorker.on('completed', (job) => {
    console.log(`✓ Question generation job ${job.id} completed`);
  });

  questionGenerationWorker.on('failed', (job, error) => {
    console.error(`✗ Question generation job ${job?.id} failed:`, error.message);
  });

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
