import { Job } from 'bullmq';
import { AssignmentModel, GeneratedPaperModel } from '@examina/database';
import type {
  GenerationEventPayload,
  QuestionGenerationJobData,
} from '@examina/types';
import { SocketChannels } from '@examina/types';
import { redis } from '../config/redis';
import { buildGeneratedPaperDocument, parseGeneratedPaperResponse } from '../ai/parser';
import { buildQuestionGenerationPrompt } from '../ai/promptBuilder';
import { describeError, withGenerationRetries } from '../ai/retries';
import { generatePaperWithGemini, getGeminiModel } from '../ai/client';

async function publishGenerationEvent(payload: GenerationEventPayload): Promise<void> {
  console.log('[Redis] worker publishing generation event:', payload);
  await redis.publish(SocketChannels.GENERATION, JSON.stringify(payload));
  console.log(`[Worker] websocket emit: generation:${payload.status}`, payload.assignmentId);
}

export async function processQuestionGeneration(job: Job<QuestionGenerationJobData>): Promise<void> {
  try {
    console.log('[Queue Consumer] received job:', {
      queue: job.queueName,
      jobId: job.id,
      jobName: job.name,
      payload: job.data,
    });

    const startedAt = new Date().toISOString();

    console.log('[Worker] starting question generation job:', {
      jobId: job.id,
      assignmentId: job.data.assignmentId,
      questionConfigCount: job.data.questionConfig.length,
    });

    await AssignmentModel.findByIdAndUpdate(job.data.assignmentId, { status: 'processing' });
    await job.updateProgress(15);

    await publishGenerationEvent({
      assignmentId: job.data.assignmentId,
      jobId: job.id ?? job.data.assignmentId,
      status: 'processing',
      progress: 15,
      message: 'Question generation started',
      timestamp: startedAt,
    });

    console.log(`✓ worker processing assignment job ${job.id}`);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    await job.updateProgress(70);

    console.log('[AI] starting structured question generation:', {
      jobId: job.id,
      assignmentId: job.data.assignmentId,
      model: getGeminiModel(),
    });

    const paper = await withGenerationRetries(async () => {
      const prompt = buildQuestionGenerationPrompt(job.data);
      const parsedOutput = await generatePaperWithGemini(prompt);

      console.log('[Parser] AI output parsed successfully');

      const validatedPaper = parseGeneratedPaperResponse(parsedOutput, job.data);
      return buildGeneratedPaperDocument(job.data.assignmentId, validatedPaper);
    });

    await GeneratedPaperModel.findOneAndUpdate(
      { assignmentId: job.data.assignmentId },
      {
        assignmentId: job.data.assignmentId,
        sections: paper.sections,
        totalMarks: paper.totalMarks,
        generatedAt: new Date(paper.generatedAt),
      },
      { upsert: true, new: true },
    );

    await AssignmentModel.findByIdAndUpdate(job.data.assignmentId, { status: 'completed' });
    await job.updateProgress(100);

    await publishGenerationEvent({
      assignmentId: job.data.assignmentId,
      jobId: job.id ?? job.data.assignmentId,
      status: 'completed',
      progress: 100,
      message: 'Question generation completed',
      paper,
      timestamp: new Date().toISOString(),
    });

    console.log(`[Worker] completed assignment job ${job.id}`);
  } catch (error) {
    console.error('[Worker] question generation job failed:', error);
    console.error('[Worker] question generation job stack/details:', describeError(error));

    await AssignmentModel.findByIdAndUpdate(job.data.assignmentId, { status: 'failed' });

    const errorMessage = error instanceof Error ? error.message : 'Unknown worker error';
    await publishGenerationEvent({
      assignmentId: job.data.assignmentId,
      jobId: job.id ?? job.data.assignmentId,
      status: 'failed',
      progress: 100,
      message: 'Question generation failed',
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });

    console.error(`✗ worker failed assignment job ${job.id}: ${errorMessage}`);
    throw error;
  }
}
