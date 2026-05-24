import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  helperText?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, label, helperText, error, id, ...props },
  ref,
) {
  const textareaId = id ?? props.name;

  return (
    <FormField label={label} helperText={helperText} error={error}>
      <textarea
        ref={ref}
        id={textareaId}
        aria-invalid={Boolean(error)}
        className={cn('field-base min-h-32 resize-y rounded-3xl py-4 focus-ring', className)}
        {...props}
      />
    </FormField>
  );
});
