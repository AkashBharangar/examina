import { Router, type Router as ExpressRouter } from 'express';
import { createAssignmentController, getAssignmentController, listAssignmentsController } from '../controllers/assignmentController.ts';
import { asyncHandler } from '../middleware/asyncHandler.ts';
import { validateRequest } from '../middleware/validateRequest.ts';
import { assignmentCreateValidator } from '../validators/assignment.ts';

export const assignmentsRouter: ExpressRouter = Router();

assignmentsRouter.post('/', validateRequest(assignmentCreateValidator), asyncHandler(createAssignmentController));
assignmentsRouter.get('/', asyncHandler(listAssignmentsController));
assignmentsRouter.get('/:id', asyncHandler(getAssignmentController));