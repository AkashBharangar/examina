import type { GeneratedPaperDocumentShape, QuestionGenerationJobData } from '@examina/types';
import { generatedPaperResponseSchema, type GeneratedPaperResponse } from './schemas';
import { GenerationError } from './retries';

function calculateTotalMarks(paper: GeneratedPaperResponse): number {
  return paper.sections.reduce(
    (sectionTotal, section) =>
      sectionTotal + section.questions.reduce((questionTotal, question) => questionTotal + question.marks, 0),
    0,
  );
}

export function parseGeneratedPaperResponse(
  rawOutput: unknown,
  jobData: QuestionGenerationJobData,
): GeneratedPaperResponse {
  const parsed = generatedPaperResponseSchema.safeParse(rawOutput);

  if (!parsed.success) {
    console.error('[Parser] Zod validation failed:', parsed.error.flatten());
    throw new GenerationError('AI output failed schema validation', {
      details: { issues: parsed.error.flatten() },
    });
  }

  const paper = parsed.data;
  const issues: string[] = [];

  if (paper.sections.length !== jobData.questionConfig.length) {
    issues.push(`Expected ${jobData.questionConfig.length} sections but received ${paper.sections.length}`);
  }

  jobData.questionConfig.forEach((config, index) => {
    const section = paper.sections[index];

    if (!section) {
      issues.push(`Missing section at index ${index}`);
      return;
    }

    if (section.questions.length !== config.count) {
      issues.push(
        `Section ${index + 1} expected ${config.count} questions but received ${section.questions.length}`,
      );
    }

    section.questions.forEach((question, questionIndex) => {
      if (question.marks !== config.marks) {
        issues.push(
          `Section ${index + 1} question ${questionIndex + 1} expected marks ${config.marks} but received ${question.marks}`,
        );
      }
    });
  });

  if (issues.length > 0) {
    console.error('[Parser] structural validation failed:', { issues });
    throw new GenerationError('AI output failed structural validation', {
      details: { issues },
    });
  }

  return paper;
}

export function buildGeneratedPaperDocument(
  assignmentId: string,
  paper: GeneratedPaperResponse,
): GeneratedPaperDocumentShape {
  return {
    assignmentId,
    sections: paper.sections,
    totalMarks: calculateTotalMarks(paper),
    generatedAt: new Date().toISOString(),
  };
}