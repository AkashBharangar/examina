'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';

type DatePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
};

function formatReadableDate(value: string) {
  if (!value) return 'Select a due date';
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function DatePicker({ label, value, onChange, error, helperText }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <span className="text-caption font-medium text-foreground">{label}</span>
        <span className="text-caption text-muted-foreground">*</span>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className={cn(
            'field-base flex items-center justify-between gap-3 text-left focus-ring',
            error && 'border-destructive',
          )}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={Boolean(error)}
        >
          <span className={cn('truncate', !value && 'text-muted-foreground')}>{formatReadableDate(value)}</span>
          <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute left-0 top-[calc(100%+0.75rem)] z-20 w-full rounded-3xl border border-border bg-surface p-4 shadow-soft sm:w-96"
              role="dialog"
            >
              <div className="space-y-3">
                <input
                  type="date"
                  value={value}
                  min={today}
                  onChange={(event) => onChange(event.target.value)}
                  className="field-base focus-ring"
                />
                <div className="flex justify-between gap-3">
                  <p className="text-caption text-muted-foreground">Choose today or a future date.</p>
                  <button
                    type="button"
                    className="text-caption font-medium text-foreground underline-offset-4 hover:underline"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {helperText && !error ? <p className="text-caption text-muted-foreground">{helperText}</p> : null}
      {error ? <p className="text-caption text-destructive">{error}</p> : null}
    </div>
  );
}
