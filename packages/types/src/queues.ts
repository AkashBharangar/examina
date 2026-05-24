export interface QueueJobData {
  id: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface ProcessingJob extends QueueJobData {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  result?: any;
  error?: string;
}

export enum QueueNames {
  ASSESSMENTS = 'assessments',
  EVALUATIONS = 'evaluations',
  NOTIFICATIONS = 'notifications',
  QUESTION_GENERATION = 'question-generation',
}

