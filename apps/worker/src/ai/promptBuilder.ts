import type { QuestionGenerationJobData } from '@examina/types';

function serializeMaterialContext(jobData: QuestionGenerationJobData): string {
  if (jobData.uploadedMaterialText?.trim()) {
    return jobData.uploadedMaterialText.trim();
  }

  if (jobData.uploadedMaterial) {
    return JSON.stringify(jobData.uploadedMaterial, null, 2);
  }

  return 'No uploaded material was provided.';
}

export function buildQuestionGenerationPrompt(jobData: QuestionGenerationJobData): string {
  const questionConfig = JSON.stringify(jobData.questionConfig, null, 2);
  const uploadedMaterialContext = serializeMaterialContext(jobData);

  return [
    'You are Examina, a production assessment authoring engine.',
    'Return STRICT JSON only. Do not use markdown, code fences, or commentary.',
    '',
    `Assignment title: ${jobData.title}`,
    `Due date: ${jobData.dueDate}`,
    `Instructions: ${jobData.instructions?.trim() || 'No extra instructions provided.'}`,
    `Question configuration: ${questionConfig}`,
    `Uploaded material context: ${uploadedMaterialContext}`,
    '',
    'Output schema (strict):',
    '{',
    '  "sections": [',
    '    {',
    '      "title": "string",',
    '      "instruction": "string",',
    '      "questions": [',
    '        {',
    '          "text": "string",',
    '          "difficulty": "easy|medium|hard",',
    '          "marks": 1',
    '        }',
    '      ]',
    '    }',
    '  ]',
    '}',
    '',
    'Generation rules:',
    '- Create exam-style sections that match the question configuration exactly.',
    '- The number of sections must equal the number of questionConfig items.',
    '- The number of questions in each section must equal the matching questionConfig.count.',
    '- The marks for every question in a section must match the matching questionConfig.marks.',
    '- Difficulty must be one of: easy, medium, hard.',
    '- Return only JSON. Never return markdown. Never return explanations.',
  ].join('\n');
}