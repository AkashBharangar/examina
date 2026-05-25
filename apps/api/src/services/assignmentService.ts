import { AssignmentModel, GeneratedPaperModel } from '@examina/database';
import type { GenerationEventPayload, QuestionGenerationJobData } from '@examina/types';
import { redis } from '../config/redis';
import { questionGenerationQueue } from '../config/queues';
import { AppError } from '../middleware/errorHandler';
import { SOCKET_CHANNELS } from '../sockets/events';
import type { AssignmentCreateInput } from '../validators/assignment';

export async function createAssignment(payload: AssignmentCreateInput) {
  console.log('[API] createAssignment received payload:', {
    title: payload.title,
    dueDate: payload.dueDate,
    instructionsLength: payload.instructions?.length ?? 0,
    questionConfigCount: payload.questionConfig.length,
    uploadedMaterial: payload.uploadedMaterial ? { name: payload.uploadedMaterial.name, size: payload.uploadedMaterial.size, type: payload.uploadedMaterial.type } : null,
  });

  const assignment = await AssignmentModel.create({
    title: payload.title,
    dueDate: payload.dueDate,
    instructions: payload.instructions ?? '',
    uploadedMaterial: payload.uploadedMaterial ?? null,
    status: 'draft',
    questionConfig: payload.questionConfig,
  });

  console.log('[API] mongo save succeeded:', {
    assignmentId: assignment._id.toString(),
    status: assignment.status,
  });

  const jobData: QuestionGenerationJobData = {
    assignmentId: assignment._id.toString(),
    title: assignment.title,
    questionConfig: payload.questionConfig,
    instructions: assignment.instructions,
    dueDate: assignment.dueDate.toISOString(),
    uploadedMaterial: assignment.uploadedMaterial,
  };

  console.log('[Queue Producer] prepared job payload:', {
    queue: questionGenerationQueue.name,
    payload: jobData,
  });

  try {
    console.log('[Queue Producer] adding BullMQ job...', {
      queue: questionGenerationQueue.name,
      jobName: 'generate-paper',
      jobId: assignment._id.toString(),
    });
    const job = await questionGenerationQueue.add('generate-paper', jobData, {
      jobId: assignment._id.toString(),
    });

    console.log('[Queue Producer] BullMQ add succeeded:', {
      jobId: job.id,
      jobName: job.name,
      queue: questionGenerationQueue.name,
    });

    await AssignmentModel.findByIdAndUpdate(assignment._id, { status: 'queued' });

    console.log('[API] assignment status updated to queued:', assignment._id.toString());

    const queuedEvent: GenerationEventPayload = {
      assignmentId: assignment._id.toString(),
      jobId: job.id ?? assignment._id.toString(),
      status: 'queued',
      progress: 0,
      message: 'Assignment queued for generation',
      timestamp: new Date().toISOString(),
    };

    console.log('[Redis] publishing queued event:', queuedEvent);
    await redis.publish(SOCKET_CHANNELS.GENERATION, JSON.stringify(queuedEvent));

    console.log('[Redis] publish succeeded for queued event:', {
      assignmentId: queuedEvent.assignmentId,
      jobId: queuedEvent.jobId,
    });

    return {
      assignmentId: assignment._id.toString(),
      jobId: job.id ?? assignment._id.toString(),
      status: 'queued' as const,
    };
  } catch (error) {
    console.error('[Queue Producer] assignment enqueue failed:', error);

    await AssignmentModel.findByIdAndUpdate(assignment._id, { status: 'failed' });

    console.log('[API] assignment status updated to failed:', assignment._id.toString());

    const failedEvent: GenerationEventPayload = {
      assignmentId: assignment._id.toString(),
      jobId: assignment._id.toString(),
      status: 'failed',
      progress: 0,
      message: 'Failed to enqueue assignment generation',
      error: error instanceof Error ? error.message : 'Unknown queue error',
      timestamp: new Date().toISOString(),
    };

    console.log('[Redis] publishing failure event:', failedEvent);
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
