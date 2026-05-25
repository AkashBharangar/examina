export type AssignmentStatus = 'draft' | 'queued' | 'processing' | 'completed' | 'failed';

export type QuestionType = 'mcq' | 'short' | 'long' | 'diagram' | 'numerical';

export interface UploadedMaterial {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface AssignmentQuestionConfig {
  type: QuestionType;
  count: number;
  marks: number;
}

export interface CreateAssignmentPayload {
  title: string;
  dueDate: string;
  instructions?: string;
  uploadedMaterial?: UploadedMaterial | null;
  questionConfig: AssignmentQuestionConfig[];
}

export interface AssignmentDocumentShape extends CreateAssignmentPayload {
  status: AssignmentStatus;
  createdAt: string;
}

export interface GeneratedQuestion {
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
}

export interface GeneratedSection {
  title: string;
  instruction: string;
  questions: GeneratedQuestion[];
}

export interface GeneratedPaperDocumentShape {
  assignmentId: string;
  sections: GeneratedSection[];
  totalMarks: number;
  generatedAt: string;
}

export interface QuestionGenerationJobData {
  assignmentId: string;
  title: string;
  questionConfig: AssignmentQuestionConfig[];
  instructions?: string;
  dueDate: string;
  uploadedMaterial?: UploadedMaterial | null;
  uploadedMaterialText?: string;
}

export type GenerationEventStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface GenerationEventPayload {
  assignmentId: string;
  jobId: string;
  status: GenerationEventStatus;
  progress?: number;
  message?: string;
  paper?: GeneratedPaperDocumentShape;
  error?: string;
  timestamp: string;
}

export const SocketChannels = {
  GENERATION: 'generation-events',
} as const;
