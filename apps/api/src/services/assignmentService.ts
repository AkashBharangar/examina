import { AssignmentModel, GeneratedPaperModel } from '@examina/database';
import type { QuestionGenerationJobData } from '@examina/types';
import { redis } from '../config/redis.ts';
import { questionGenerationQueue } from '../config/queues.ts';
import { AppError } from '../middleware/errorHandler.ts';
import { SOCKET_CHANNELS } from '../sockets/events.ts';
import type { AssignmentCreateInput } from '../validators/assignment.ts';

export async function createAssignment(payload: AssignmentCreateInput) {
  const assignment = await AssignmentModel.create({
    title: payload.title,
    dueDate: payload.dueDate,
    instructions: payload.instructions ?? '',
    uploadedMaterial: payload.uploadedMaterial ?? null,
    status: 'queued',
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

  const job = await questionGenerationQueue.add('generate-paper', jobData, {
    jobId: assignment._id.toString(),
  });

  const queuedEvent = {
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