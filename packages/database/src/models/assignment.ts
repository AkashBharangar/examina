import mongoose from 'mongoose';
import type { InferSchemaType, Model } from 'mongoose';
import type { AssignmentQuestionConfig, AssignmentStatus, UploadedMaterial } from '@examina/types';

const { Schema, model, models } = mongoose;

const uploadedMaterialSchema = new Schema<UploadedMaterial>(
  {
    name: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, required: true },
    lastModified: { type: Number, required: true },
  },
  { _id: false },
);

const questionConfigSchema = new Schema<AssignmentQuestionConfig>(
  {
    type: {
      type: String,
      required: true,
      enum: ['mcq', 'short', 'long', 'diagram', 'numerical'],
    },
    count: { type: Number, required: true, min: 1 },
    marks: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const assignmentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },
    instructions: { type: String, default: '' },
    uploadedMaterial: { type: uploadedMaterialSchema, default: null },
    status: {
      type: String,
      enum: ['draft', 'queued', 'processing', 'completed', 'failed'],
      default: 'draft',
      required: true,
    },
    questionConfig: { type: [questionConfigSchema], required: true, default: [] },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

export type AssignmentDocument = InferSchemaType<typeof assignmentSchema> & {
  _id: mongoose.Types.ObjectId;
  status: AssignmentStatus;
  uploadedMaterial: UploadedMaterial | null;
};

export const AssignmentModel: Model<AssignmentDocument> =
  models.Assignment || model<AssignmentDocument>('Assignment', assignmentSchema);
