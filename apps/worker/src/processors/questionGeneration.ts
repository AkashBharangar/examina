import { Job } from 'bullmq';
import { AssignmentModel, GeneratedPaperModel } from '@examina/database';
import type {
  GenerationEventPayload,
  GeneratedPaperDocumentShape,
  QuestionGenerationJobData,
} from '@examina/types';
import { SocketChannels } from '@examina/types';
import { redis } from '../config/redis';

function buildMockPaper(jobData: QuestionGenerationJobData): GeneratedPaperDocumentShape {
  const sections = jobData.questionConfig.map((config, index) => {
    const sectionTitleMap: Record<string, string> = {
      mcq: 'Multiple Choice',
      short: 'Short Answer',
      long: 'Extended Response',
      diagram: 'Diagram / Graph',
      numerical: 'Numerical Problems',
    };

    const difficultyCycle: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];

    return {
      title: `${index + 1}. ${sectionTitleMap[config.type] ?? 'Section'}`,
      instruction: `Answer all ${config.questions} questions carefully.`,
      questions: Array.from({ length: config.questions }, (_, questionIndex) => ({
        text: `Question ${questionIndex + 1} for ${sectionTitleMap[config.type] ?? config.type}`,
        difficulty: difficultyCycle[questionIndex % difficultyCycle.length]!,
        marks: config.marks,
      })),
    };
  });

  const totalMarks = sections.reduce(
    (sectionTotal, section) =>
      sectionTotal + section.questions.reduce((questionTotal, question) => questionTotal + question.marks, 0),
    0,
  );

  return {
    assignmentId: jobData.assignmentId,
    sections,
    totalMarks,
    generatedAt: new Date().toISOString(),
  };
}

async function publishGenerationEvent(payload: GenerationEventPayload): Promise<void> {
  await redis.publish(SocketChannels.GENERATION, JSON.stringify(payload));
  console.log(`✓ websocket emit: generation:${payload.status}`, payload.assignmentId);
}

export async function processQuestionGeneration(job: Job<QuestionGenerationJobData>): Promise<void> {
  try {
    const startedAt = new Date().toISOString();

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

    const paper = buildMockPaper(job.data);
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

    console.log(`✓ worker completed assignment job ${job.id}`);
  } catch (error) {
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
