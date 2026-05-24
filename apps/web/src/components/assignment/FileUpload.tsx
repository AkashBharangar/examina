'use client';

import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { UploadIcon, TrashIcon } from '@/components/shared/Icons';
import { SecondaryButton } from '@/components/shared/SecondaryButton';
import type { DraftFileMeta } from '@/store/assignmentDraft';
import { cn } from '@/lib/utils';

type FileUploadProps = {
  file: File | null;
  storedFileMeta: DraftFileMeta | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  error?: string;
};

const acceptedTypes = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function isAllowedFile(file: File) {
  return acceptedTypes.includes(file.type) || /\.(pdf|txt|doc|docx)$/i.test(file.name);
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({ file, storedFileMeta, onFileSelect, onRemove, error }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const currentFile = file ?? storedFileMeta;

  const preview = useMemo(() => {
    if (!currentFile) return null;

    return {
      name: currentFile.name,
      size: currentFile.size,
      type: currentFile.type,
      lastModified: currentFile.lastModified,
      restored: !file && Boolean(storedFileMeta),
    };
  }, [currentFile, file, storedFileMeta]);

  const handleFiles = (selectedFiles: FileList | null) => {
    const nextFile = selectedFiles?.[0];
    if (!nextFile) return;
    if (!isAllowedFile(nextFile)) return;
    onFileSelect(nextFile);
  };

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={cn(
          'group rounded-3xl border-2 border-dashed bg-surface-quiet px-6 py-8 text-center transition-all duration-200 focus-ring',
          isDragging ? 'border-primary bg-white shadow-sm' : 'border-border hover:border-primary/35 hover:bg-white/80',
          error && 'border-destructive',
        )}
        aria-label="Upload assignment material"
      >
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept=".pdf,.txt,.doc,.docx,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(event) => handleFiles(event.target.files)}
        />

        {preview ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto flex max-w-sm flex-col items-center gap-4"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <UploadIcon className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-foreground">{preview.name}</div>
              <div className="text-caption text-muted-foreground">
                {formatFileSize(preview.size)} · {preview.type || 'Document'}
                {preview.restored ? ' · Restored from draft' : ''}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="mx-auto flex max-w-sm flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-white text-foreground shadow-sm">
              <UploadIcon className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <div className="text-sm font-semibold text-foreground">Drop your material here</div>
              <p className="text-caption leading-5 text-muted-foreground">
                Or click to upload PDF, text, DOC, or DOCX files.
              </p>
            </div>
            <span className="pill-button hidden border border-border bg-white text-foreground shadow-sm sm:inline-flex">
              Choose file
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-caption text-muted-foreground">Accepted formats: PDF, TXT, DOC, DOCX</p>
        {preview ? (
          <SecondaryButton type="button" className="gap-2" onClick={onRemove}>
            <TrashIcon className="h-4 w-4" />
            Remove file
          </SecondaryButton>
        ) : null}
      </div>
      {error ? <p className="text-caption text-destructive">{error}</p> : null}
    </div>
  );
}
