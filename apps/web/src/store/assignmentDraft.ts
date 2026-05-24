import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';
import type { AssignmentCreateValues } from '@/schemas/assignment';
import { defaultAssignmentCreateValues } from '@/schemas/assignment';

export type DraftFileMeta = {
  name: string;
  size: number;
  type: string;
  lastModified: number;
};

type AssignmentDraftState = {
  draft: AssignmentCreateValues;
  uploadedFileMeta: DraftFileMeta | null;
  isHydrated: boolean;
  setDraft: (draft: AssignmentCreateValues) => void;
  setUploadedFileMeta: (fileMeta: DraftFileMeta | null) => void;
  resetDraft: () => void;
  markHydrated: (hydrated: boolean) => void;
};

export const useAssignmentDraftStore = create<AssignmentDraftState>()(
  persist(
    (set) => ({
      draft: defaultAssignmentCreateValues,
      uploadedFileMeta: null,
      isHydrated: false,
      setDraft: (draft) => set({ draft }),
      setUploadedFileMeta: (uploadedFileMeta) => set({ uploadedFileMeta }),
      resetDraft: () => set({ draft: defaultAssignmentCreateValues, uploadedFileMeta: null }),
      markHydrated: (isHydrated) => set({ isHydrated }),
    }),
    {
      name: 'examina-assignment-draft',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        draft: state.draft,
        uploadedFileMeta: state.uploadedFileMeta,
      }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated(true);
      },
    },
  ),
);
