import { Router, type Router as ExpressRouter } from 'express';
import { createAssignmentController, getAssignmentController, listAssignmentsController } from '../controllers/assignmentController';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateRequest } from '../middleware/validateRequest';
import { assignmentCreateValidator } from '../validators/assignment';

export const assignmentsRouter: ExpressRouter = Router();

assignmentsRouter.post('/', validateRequest(assignmentCreateValidator), asyncHandler(createAssignmentController));
assignmentsRouter.get('/', asyncHandler(listAssignmentsController));
assignmentsRouter.get('/:id', asyncHandler(getAssignmentController));