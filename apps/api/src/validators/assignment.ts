import { z } from 'zod';

const questionTypes = ['mcq', 'short', 'long', 'diagram', 'numerical'] as const;

export const assignmentCreateValidator = z
  .object({
    title: z.string().trim().min(1, 'Title is required'),
    dueDate: z.coerce.date().refine((date) => date.getTime() >= new Date(new Date().toDateString()).getTime(), {
      message: 'Due date cannot be in the past',
    }),
    instructions: z.string().trim().optional().default(''),
    uploadedMaterial: z
      .object({
        name: z.string().min(1),
        size: z.number().int().nonnegative(),
        type: z.string().min(1),
        lastModified: z.number().int().nonnegative(),
      })
      .nullable()
      .optional(),
    questionConfig: z.array(
      z.object({
        type: z.enum(questionTypes),
        questions: z.number().int().min(1, 'At least 1 question is required'),
        marks: z.number().int().min(1, 'Marks must be greater than 0'),
      }),
    ).min(1, 'Add at least one question type'),
  })
  .superRefine((value, context) => {
    const seen = new Set<string>();

    value.questionConfig.forEach((item, index) => {
      if (seen.has(item.type)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['questionConfig', index, 'type'],
          message: 'Question types must be unique',
        });
      }

      seen.add(item.type);
    });
  });

export type AssignmentCreateInput = z.infer<typeof assignmentCreateValidator>;