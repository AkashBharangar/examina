import { z } from 'zod';

export const generatedDifficultySchema = z.enum(['easy', 'medium', 'hard']);

export const generatedQuestionSchema = z.object({
  text: z.string().trim().min(1),
  difficulty: generatedDifficultySchema,
  marks: z.number().int().positive(),
});

export const generatedSectionSchema = z.object({
  title: z.string().trim().min(1),
  instruction: z.string().trim().min(1),
  questions: z.array(generatedQuestionSchema).min(1),
});

export const generatedPaperResponseSchema = z.object({
  sections: z.array(generatedSectionSchema).min(1),
});

export type GeneratedPaperResponse = z.infer<typeof generatedPaperResponseSchema>;