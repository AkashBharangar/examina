import { AssignmentModel, GeneratedPaperModel } from '@examina/database';
import type { GenerationEventPayload, QuestionGenerationJobData } from '@examina/types';
import { redis } from '../config/redis';
import { questionGenerationQueue } from '../config/queues';
import { AppError } from '../middleware/errorHandler';
import { SOCKET_CHANNELS } from '../sockets/events';
import type { AssignmentCreateInput } from '../validators/assignment';

export async function createAssignment(payload: AssignmentCreateInput) {
  const assignment = await AssignmentModel.create({
    title: payload.title,
    dueDate: payload.dueDate,
    instructions: payload.instructions ?? '',
    uploadedMaterial: payload.uploadedMaterial ?? null,
    status: 'draft',
    questionConfig: payload.questionConfig,
  });

  const jobData: QuestionGenerationJobData = {
    assignmentId: assignment._id.toString(),
    title: assignment.title,
    questionConfig: payload.questionConfig,
    instructions: assignment.instructions,
    dueDate: assignment.dueDate.toISOString(),
    uploadedMaterial: assignment.uploadedMaterial,
  };

  try {
    const job = await questionGenerationQueue.add('generate-paper', jobData, {
      jobId: assignment._id.toString(),
    });

    await AssignmentModel.findByIdAndUpdate(assignment._id, { status: 'queued' });

    const queuedEvent: GenerationEventPayload = {
      assignmentId: assignment._id.toString(),
      jobId: job.id ?? assignment._id.toString(),
      status: 'queued',
      progress: 0,
      message: 'Assignment queued for generation',
      timestamp: new Date().toISOString(),
    };

    console.log('✓ queue event: assignment queued', queuedEvent);
    await redis.publish(SOCKET_CHANNELS.GENERATION, JSON.stringify(queuedEvent));

    return {
      assignmentId: assignment._id.toString(),
      jobId: job.id ?? assignment._id.toString(),
    };
  } catch (error) {
    await AssignmentModel.findByIdAndUpdate(assignment._id, { status: 'failed' });

    const failedEvent: GenerationEventPayload = {
      assignmentId: assignment._id.toString(),
      jobId: assignment._id.toString(),
      status: 'failed',
      progress: 0,
      message: 'Failed to enqueue assignment generation',
      error: error instanceof Error ? error.message : 'Unknown queue error',
      timestamp: new Date().toISOString(),
    };

    await redis.publish(SOCKET_CHANNELS.GENERATION, JSON.stringify(failedEvent));
    throw new AppError('Failed to enqueue assignment generation', 500, 'QUEUE_ENQUEUE_FAILED');
  }
}

export async function listAssignments() {
  return AssignmentModel.find().sort({ createdAt: -1 }).lean();
}

export async function getAssignmentById(id: string) {
  const assignment = await AssignmentModel.findById(id).lean();

  if (!assignment) {
    throw new AppError('Assignment not found', 404, 'ASSIGNMENT_NOT_FOUND');
  }

  const generatedPaper = await GeneratedPaperModel.findOne({ assignmentId: id }).lean();

  return {
    ...assignment,
    generatedPaper,
  };
}
