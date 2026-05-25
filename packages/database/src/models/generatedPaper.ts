import mongoose from 'mongoose';
import type { InferSchemaType, Model } from 'mongoose';
import type { GeneratedSection } from '@examina/types';

const { Schema, model, models } = mongoose;

const generatedQuestionSchema = new Schema(
  {
    text: { type: String, required: true },
    difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
    marks: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const generatedSectionSchema = new Schema<GeneratedSection>(
  {
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: { type: [generatedQuestionSchema], required: true, default: [] },
  },
  { _id: false },
);

const generatedPaperSchema = new Schema(
  {
    assignmentId: { type: Schema.Types.ObjectId, required: true, ref: 'Assignment', index: true },
    sections: { type: [generatedSectionSchema], required: true, default: [] },
    totalMarks: { type: Number, required: true, min: 1 },
    generatedAt: { type: Date, required: true },
  },
  {
    versionKey: false,
  },
);

export type GeneratedPaperDocument = InferSchemaType<typeof generatedPaperSchema>;

export const GeneratedPaperModel: Model<GeneratedPaperDocument> =
  models.GeneratedPaper || model<GeneratedPaperDocument>('GeneratedPaper', generatedPaperSchema);
