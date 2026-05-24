import type { Request, Response } from 'express';
import { createAssignment, getAssignmentById, listAssignments } from '../services/assignmentService.ts';
import { AppError } from '../middleware/errorHandler.ts';

export async function createAssignmentController(req: Request, res: Response): Promise<void> {
  const result = await createAssignment(req.body);

  res.status(201).json({
    success: true,
    data: result,
    timestamp: new Date().toISOString(),
  });
}

export async function listAssignmentsController(_req: Request, res: Response): Promise<void> {
  const assignments = await listAssignments();

  res.json({
    success: true,
    data: assignments,
    timestamp: new Date().toISOString(),
  });
}

export async function getAssignmentController(req: Request, res: Response): Promise<void> {
  const assignmentId = req.params.id;

  if (!assignmentId) {
    throw new AppError('Assignment id is required', 400, 'ASSIGNMENT_ID_REQUIRED');
  }

  const assignment = await getAssignmentById(assignmentId);

  res.json({
    success: true,
    data: assignment,
    timestamp: new Date().toISOString(),
  });
}