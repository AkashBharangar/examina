import { z } from 'zod';

export const questionTypeOptions = [
  { label: 'MCQ', value: 'mcq' },
  { label: 'Short Questions', value: 'short' },
  { label: 'Long Questions', value: 'long' },
  { label: 'Diagram/Graph Questions', value: 'diagram' },
  { label: 'Numerical Problems', value: 'numerical' },
] as const;

export const questionTypeValues = questionTypeOptions.map((option) => option.value) as [
  (typeof questionTypeOptions)[number]['value'],
  ...Array<(typeof questionTypeOptions)[number]['value']>,
];

export const questionConfigSchema = z.object({
  type: z.enum(questionTypeValues, {
    errorMap: () => ({ message: 'Choose a question type' }),
  }),
  count: z
    .number({ invalid_type_error: 'Enter the number of questions' })
    .int('Use a whole number')
    .min(1, 'At least 1 question is required'),
  marks: z
    .number({ invalid_type_error: 'Enter the marks value' })
    .int('Use a whole number')
    .min(1, 'Marks must be greater than 0'),
});

export const assignmentCreateSchema = z
  .object({
    assignmentTitle: z.string().trim().min(1, 'Assignment title is required'),
    courseName: z.string().trim().min(1, 'Course name is required'),
    dueDate: z
      .string()
      .min(1, 'Due date is required')
      .refine((value) => {
        const today = new Date().toISOString().slice(0, 10);
        return value >= today;
      }, 'Due date cannot be in the past'),
    instructions: z.string().trim().optional().default(''),
    questions: z.array(questionConfigSchema).min(1, 'Add at least one question type'),
  })
  .superRefine((value, context) => {
    const seen = new Set<string>();

    value.questions.forEach((question, index) => {
      if (seen.has(question.type)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['questions', index, 'type'],
          message: 'Question types must be unique',
        });
      }

      seen.add(question.type);
    });
  });

export type AssignmentCreateValues = z.infer<typeof assignmentCreateSchema>;
export type QuestionType = AssignmentCreateValues['questions'][number]['type'];

export const defaultQuestionConfig = (): AssignmentCreateValues['questions'][number] => ({
  type: 'mcq',
  count: 1,
  marks: 1,
});

export const defaultAssignmentCreateValues: AssignmentCreateValues = {
  assignmentTitle: '',
  courseName: '',
  dueDate: '',
  instructions: '',
  questions: [defaultQuestionConfig()],
};
