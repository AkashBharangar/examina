'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Controller, FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/shared/Card';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { SecondaryButton } from '@/components/shared/SecondaryButton';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Textarea } from '@/components/forms/Textarea';
import { Input } from '@/components/forms/Input';
import { DatePicker } from './DatePicker';
import { FileUpload } from './FileUpload';
import { QuestionConfigRow } from './QuestionConfigRow';
import {
  assignmentCreateSchema,
  defaultAssignmentCreateValues,
  defaultQuestionConfig,
  questionTypeOptions,
  type AssignmentCreateValues,
} from '@/schemas/assignment';
import { useAssignmentDraftStore } from '@/store/assignmentDraft';
import { Badge } from '@/components/shared/Badge';
import { PlusIcon } from '@/components/shared/Icons';

export function AssignmentCreateForm() {
  const router = useRouter();
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const initializedRef = useRef(false);

  const draft = useAssignmentDraftStore((state) => state.draft);
  const uploadedFileMeta = useAssignmentDraftStore((state) => state.uploadedFileMeta);
  const isHydrated = useAssignmentDraftStore((state) => state.isHydrated);
  const setDraft = useAssignmentDraftStore((state) => state.setDraft);
  const setUploadedFileMeta = useAssignmentDraftStore((state) => state.setUploadedFileMeta);

  useEffect(() => {
    void useAssignmentDraftStore.persist.rehydrate();
  }, []);

  const methods = useForm<AssignmentCreateValues>({
    resolver: zodResolver(assignmentCreateSchema),
    mode: 'onChange',
    defaultValues: defaultAssignmentCreateValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors, isValid },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const watchedQuestions = useWatch({ control, name: 'questions' });
  const watchedDraftValues = useWatch({ control });

  useEffect(() => {
    if (!isHydrated || initializedRef.current) return;

    reset({
      ...draft,
      questions: draft.questions.length > 0 ? draft.questions : [defaultQuestionConfig()],
    });
    initializedRef.current = true;
  }, [draft, isHydrated, reset]);

  useEffect(() => {
    if (!initializedRef.current) return;
    setDraft({
      assignmentTitle: watchedDraftValues?.assignmentTitle ?? '',
      courseName: watchedDraftValues?.courseName ?? '',
      dueDate: watchedDraftValues?.dueDate ?? '',
      instructions: watchedDraftValues?.instructions ?? '',
      questions: watchedQuestions?.length ? watchedQuestions : [defaultQuestionConfig()],
    });
  }, [setDraft, watchedDraftValues, watchedQuestions]);

  const selectedTypes = useMemo(
    () => (watchedQuestions ?? []).map((question) => question?.type).filter(Boolean) as string[],
    [watchedQuestions],
  );

  const totals = useMemo(() => {
    const questions = watchedQuestions ?? [];

    return questions.reduce(
      (accumulator, question) => ({
        totalQuestions: accumulator.totalQuestions + (Number(question?.questions) || 0),
        totalMarks: accumulator.totalMarks + (Number(question?.questions) || 0) * (Number(question?.marks) || 0),
      }),
      { totalQuestions: 0, totalMarks: 0 },
    );
  }, [watchedQuestions]);

  const handleFileSelect = (file: File) => {
    setCurrentFile(file);
    setUploadedFileMeta({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    });
  };

  const handleFileRemove = () => {
    setCurrentFile(null);
    setUploadedFileMeta(null);
  };

  const onSubmit = async (values: AssignmentCreateValues) => {
    setIsSaving(true);
    setSavedMessage(null);

    try {
      setDraft(values);
      await new Promise((resolve) => window.setTimeout(resolve, 350));
      setSavedMessage('Draft saved locally.');
      router.prefetch('/assignments');
    } finally {
      setIsSaving(false);
    }
  };

  const addQuestionRow = () => {
    const usedTypes = new Set((watchedQuestions ?? []).map((question) => question?.type).filter(Boolean));
    const nextType = questionTypeOptions.map((option) => option.value).find((type) => !usedTypes.has(type));

    if (!nextType) return;

    append({
      type: nextType,
      questions: 1,
      marks: 1,
    });
  };

  const canAddQuestionRow = (watchedQuestions?.length ?? 0) < questionTypeOptions.length;

  const hasFile = Boolean(currentFile || uploadedFileMeta);

  return (
    <FormProvider {...methods}>
      <div className="mx-auto w-full max-w-4xl space-y-6 pb-10">
        <SectionHeader
          eyebrow="Assignments"
          title="Create Assignment"
          description="Build a focused, academic assessment in a clean form that stays responsive across desktop and mobile."
          actions={
            <Link href="/assignments" className="pill-button border border-border bg-surface text-foreground hover:bg-muted/60">
              Back to assignments
            </Link>
          }
        />

        <Card className="overflow-hidden p-0 shadow-card">
          <form
            onSubmit={(event) => {
              void handleSubmit(onSubmit)(event);
            }}
            noValidate
          >
            <div className="border-b border-border bg-surface-quiet/60 px-5 py-4 sm:px-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-section-title font-semibold tracking-tight text-foreground">Assignment Details</h2>
                  <p className="mt-1 text-caption text-muted-foreground">Keep the setup minimal and focused.</p>
                </div>
                <Badge variant={hasFile ? 'success' : 'outline'}>{hasFile ? 'Material added' : 'No material uploaded'}</Badge>
              </div>
            </div>

            <div className="space-y-8 px-5 py-6 sm:px-7 sm:py-7">
              <section className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Assignment Title"
                  placeholder="e.g. Calculus Practice Assessment"
                  error={errors.assignmentTitle?.message}
                  {...register('assignmentTitle')}
                />
                <Input
                  label="Course / Subject"
                  placeholder="e.g. Mathematics"
                  error={errors.courseName?.message}
                  {...register('courseName')}
                />
                <div className="md:col-span-2">
                  <Textarea
                    label="Additional Instructions"
                    placeholder="Enter any optional notes for students or graders."
                    helperText="Optional guidance, marking notes, or constraints."
                    error={errors.instructions?.message}
                    {...register('instructions')}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <div>
                  <h3 className="text-card-title font-semibold text-foreground">Upload Material</h3>
                  <p className="mt-1 text-caption text-muted-foreground">Drag and drop a supporting document or click to browse.</p>
                </div>

                <FileUpload
                  file={currentFile}
                  storedFileMeta={uploadedFileMeta}
                  onFileSelect={handleFileSelect}
                  onRemove={handleFileRemove}
                />
              </section>

              <section className="space-y-4">
                <div>
                  <h3 className="text-card-title font-semibold text-foreground">Due Date</h3>
                  <p className="mt-1 text-caption text-muted-foreground">Select a future date for the assignment deadline.</p>
                </div>

                <Controller
                  control={control}
                  name="dueDate"
                  render={({ field }) => (
                    <DatePicker
                      label="Due Date"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.dueDate?.message}
                      helperText="No past dates allowed."
                    />
                  )}
                />
              </section>

              <section className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 className="text-card-title font-semibold text-foreground">Question Configuration</h3>
                    <p className="mt-1 text-caption text-muted-foreground">Each type can only be used once.</p>
                  </div>
                  <SecondaryButton type="button" className="gap-2" onClick={addQuestionRow} disabled={!canAddQuestionRow}>
                    <PlusIcon className="h-4 w-4" />
                    Add Question Type
                  </SecondaryButton>
                </div>

                <AnimatePresence initial={false}>
                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                      >
                        <QuestionConfigRow
                          index={index}
                          onRemove={() => remove(index)}
                          selectedTypes={selectedTypes}
                          canRemove={fields.length > 1}
                        />
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>

                {errors.questions?.message ? <p className="text-caption text-destructive">{errors.questions.message}</p> : null}
              </section>

              <section className="grid gap-4 rounded-3xl border border-border bg-surface-quiet p-4 sm:grid-cols-2 sm:p-5">
                <div>
                  <div className="text-caption font-medium uppercase tracking-[0.22em] text-muted-foreground">Total Questions</div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{totals.totalQuestions}</div>
                </div>
                <div>
                  <div className="text-caption font-medium uppercase tracking-[0.22em] text-muted-foreground">Total Marks</div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{totals.totalMarks}</div>
                </div>
              </section>

              <AnimatePresence>
                {savedMessage ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="rounded-3xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                  >
                    {savedMessage}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <SecondaryButton
                  type="button"
                  onClick={() => {
                    reset(defaultAssignmentCreateValues);
                    handleFileRemove();
                    setSavedMessage(null);
                  }}
                >
                  Reset Draft
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={!isValid || isSaving} className="min-w-[180px]">
                  {isSaving ? 'Saving draft…' : 'Create Assignment'}
                </PrimaryButton>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </FormProvider>
  );
}
