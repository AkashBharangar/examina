'use client';

import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Select } from '@/components/forms/Select';
import { Input } from '@/components/forms/Input';
import { SecondaryButton } from '@/components/shared/SecondaryButton';
import { TrashIcon } from '@/components/shared/Icons';
import { questionTypeOptions, type AssignmentCreateValues } from '@/schemas/assignment';

type QuestionConfigRowProps = {
  index: number;
  onRemove: () => void;
  selectedTypes: string[];
  canRemove: boolean;
};

export function QuestionConfigRow({ index, onRemove, selectedTypes, canRemove }: QuestionConfigRowProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AssignmentCreateValues>();

  const currentType = useWatch({ control, name: `questions.${index}.type` });

  const typeErrors = errors.questions?.[index]?.type?.message;
  const questionCountError = errors.questions?.[index]?.count?.message;
  const marksError = errors.questions?.[index]?.marks?.message;

  const disabledTypes = useMemo(
    () => new Set(selectedTypes.filter((type) => type && type !== currentType)),
    [currentType, selectedTypes],
  );

  return (
    <div className="rounded-3xl border border-border bg-surface-quiet p-4 sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_repeat(2,minmax(0,0.5fr))_auto] lg:items-end">
        <Select
          label={`Question Type ${index + 1}`}
          error={typeErrors}
          {...register(`questions.${index}.type`)}
        >
          <option value="">Select type</option>
          {questionTypeOptions.map((option) => (
            <option key={option.value} value={option.value} disabled={disabledTypes.has(option.value)}>
              {option.label}
            </option>
          ))}
        </Select>

        <Input
          type="number"
          min={1}
          step={1}
          label="Number of Questions"
          error={questionCountError}
          {...register(`questions.${index}.count`, { valueAsNumber: true })}
        />

        <Input
          type="number"
          min={1}
          step={1}
          label="Marks"
          error={marksError}
          {...register(`questions.${index}.marks`, { valueAsNumber: true })}
        />

        <SecondaryButton type="button" onClick={onRemove} className="gap-2 lg:h-[3.25rem]" disabled={!canRemove}>
          <TrashIcon className="h-4 w-4" />
          Remove
        </SecondaryButton>
      </div>
    </div>
  );
}
