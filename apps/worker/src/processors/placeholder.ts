import { Job } from 'bullmq';
import { ProcessingJob } from '@examina/types';

export async function processAssessment(job: Job<ProcessingJob>): Promise<void> {
  console.log(`Processing assessment job: ${job.id}`);
  console.log('Job data:', job.data);

  try {
    await job.updateProgress(50);
    console.log('Job progress: 50%');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await job.updateProgress(100);
    console.log('Job completed successfully');
  } catch (error) {
    console.error('Job processing failed:', error);
    throw error;
  }
}

export async function processEvaluation(job: Job<ProcessingJob>): Promise<void> {
  console.log(`Processing evaluation job: ${job.id}`);
  console.log('Job data:', job.data);

  try {
    await job.updateProgress(100);
    console.log('Job completed successfully');
  } catch (error) {
    console.error('Job processing failed:', error);
    throw error;
  }
}

export async function processNotification(job: Job<ProcessingJob>): Promise<void> {
  console.log(`Processing notification job: ${job.id}`);
  console.log('Job data:', job.data);

  try {
    await job.updateProgress(100);
    console.log('Job completed successfully');
  } catch (error) {
    console.error('Job processing failed:', error);
    throw error;
  }
}
