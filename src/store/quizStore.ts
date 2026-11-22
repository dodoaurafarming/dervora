import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '../lib/firebase';

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  'https://dervora-backend.vercel.app';

export interface RemoteSkinProfile {
  id?: number;
  skinType?: string;
  concerns?: string[];
  answers?: Record<string, string | string[]> | null;
  completedAt?: string;
  updatedAt?: string;
}

export interface SkinProfileSummary {
  skinType?: string;
  concerns?: string[];
}

interface UserQuizData {
  answers: Record<string, string | string[]>;
  currentStep: number;
  completed: boolean;
}

const EMPTY_QUIZ: UserQuizData = {
  answers: {},
  currentStep: 0,
  completed: false,
};

const isValidAnswersRecord = (
  value: unknown
): value is Record<string, string | string[]> => {
  return (
    !!value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value as Record<string, unknown>).length > 0
  );
};

interface QuizState extends UserQuizData {
  activeUserId: string | null;
  userRecords: Record<string, UserQuizData>;
  isSyncing: boolean;

  loadUserQuiz: (userId: string, remoteProfile?: RemoteSkinProfile | null) => void;
  syncQuizToBackend: (
    answersOverride?: Record<string, string | string[]>,
    summary?: SkinProfileSummary
  ) => Promise<boolean>;
  clearActiveSession: () => void;
  setAnswer: (questionId: string, value: string | string[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
  complete: (summary?: SkinProfileSummary) => void;
}

const buildUpdatedState = (
  state: QuizState,
  patch: Partial<UserQuizData>
): Partial<QuizState> => {
  const nextData: UserQuizData = {
    answers: patch.answers ?? state.answers,
    currentStep: patch.currentStep ?? state.currentStep,
    completed: patch.completed ?? state.completed,
  };

  if (!state.activeUserId) {
    return nextData;
  }

  return {
    ...nextData,
    userRecords: {
      ...(state.userRecords ?? {}),
      [state.activeUserId]: nextData,
    },
  };
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      activeUserId: null,
      userRecords: {},
      isSyncing: false,
      ...EMPTY_QUIZ,

      syncQuizToBackend: async (answersOverride, summary) => {
        const user = auth.currentUser;
        const answers = answersOverride ?? get().answers;

        if (!user || !isValidAnswersRecord(answers)) {
          return false;
        }

        set({ isSyncing: true });
        try {
          const token = await user.getIdToken();
          const skinType =
            typeof summary?.skinType === 'string' && summary.skinType.trim()
              ? summary.skinType.trim()
              : 'Synced';
          const concerns = Array.isArray(summary?.concerns)
            ? summary.concerns.filter((item): item is string => typeof item === 'string')
            : [];

          const res = await fetch(`${BACKEND_URL}/api/skin-profile`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              answers,
              skinType,
              concerns,
            }),
          });

          if (!res.ok) {
            console.error('Gagal menyimpan skinProfile ke server:', res.status);
            return false;
          }

          return true;
        } catch (error) {
          console.error('Error sinkronisasi skinProfile ke server:', error);
          return false;
        } finally {
          set({ isSyncing: false });
        }
      },

      loadUserQuiz: (userId, remoteProfile) => {
        let answersToAutoUpload: Record<string, string | string[]> | null = null;

        set((state) => {
          const records = state.userRecords ?? {};
          const localSaved = records[userId];

          // 1. Prioritas utama: data dari database TiDB (sinkron lintas device)
          if (isValidAnswersRecord(remoteProfile?.answers)) {
            const syncedData: UserQuizData = {
              answers: remoteProfile.answers,
              currentStep: 0,
              completed: true,
            };

            return {
              activeUserId: userId,
              ...syncedData,
              userRecords: {
                ...records,
                [userId]: syncedData,
              },
            };
          }

          // 2. Fallback: data lokal lama milik akun ini -> auto-backup ke TiDB
          if (localSaved?.completed && isValidAnswersRecord(localSaved.answers)) {
            answersToAutoUpload = localSaved.answers;
            return {
              activeUserId: userId,
              answers: localSaved.answers,
              currentStep: localSaved.currentStep,
              completed: true,
            };
          }

          // 3. Fallback: user baru menyelesaikan kuis sebagai guest lalu login -> migrasikan ke TiDB
          if (!state.activeUserId && state.completed && isValidAnswersRecord(state.answers)) {
            const migratedData: UserQuizData = {
              answers: state.answers,
              currentStep: state.currentStep,
              completed: true,
            };
            answersToAutoUpload = migratedData.answers;

            return {
              activeUserId: userId,
              ...migratedData,
              userRecords: {
                ...records,
                [userId]: migratedData,
              },
            };
          }

          // 4. Belum punya profil selesai di server maupun lokal
          const fallback = localSaved ?? EMPTY_QUIZ;
          return {
            activeUserId: userId,
            answers: fallback.answers,
            currentStep: fallback.currentStep,
            completed: fallback.completed,
          };
        });

        if (answersToAutoUpload) {
          void get().syncQuizToBackend(answersToAutoUpload);
        }
      },

      clearActiveSession: () =>
        set({
          activeUserId: null,
          isSyncing: false,
          ...EMPTY_QUIZ,
        }),

      setAnswer: (questionId, value) =>
        set((state) =>
          buildUpdatedState(state, {
            answers: {
              ...state.answers,
              [questionId]: value,
            },
          })
        ),

      nextStep: () =>
        set((state) =>
          buildUpdatedState(state, {
            currentStep: state.currentStep + 1,
          })
        ),

      prevStep: () =>
        set((state) =>
          buildUpdatedState(state, {
            currentStep: Math.max(0, state.currentStep - 1),
          })
        ),

      goToStep: (step) =>
        set((state) =>
          buildUpdatedState(state, {
            currentStep: step,
          })
        ),

      reset: () =>
        set((state) =>
          buildUpdatedState(state, {
            ...EMPTY_QUIZ,
          })
        ),

      complete: (summary) => {
        set((state) =>
          buildUpdatedState(state, {
            completed: true,
          })
        );

        const safeSummary: SkinProfileSummary | undefined =
          summary && typeof summary === 'object' && !('nativeEvent' in summary)
            ? summary
            : undefined;

        const currentAnswers = get().answers;
        if (auth.currentUser && isValidAnswersRecord(currentAnswers)) {
          void get().syncQuizToBackend(currentAnswers, safeSummary);
        }
      },
    }),
    {
      name: 'dervora_quiz',
      partialize: (state) => ({
        userRecords: state.userRecords,
      }),
    }
  )
);