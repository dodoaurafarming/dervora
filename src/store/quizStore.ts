import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface QuizState extends UserQuizData {
  activeUserId: string | null;
  userRecords: Record<string, UserQuizData>;

  loadUserQuiz: (userId: string) => void;
  clearActiveSession: () => void;
  setAnswer: (questionId: string, value: string | string[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
  complete: () => void;
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
    (set) => ({
      activeUserId: null,
      userRecords: {},
      ...EMPTY_QUIZ,

      loadUserQuiz: (userId) =>
        set((state) => {
          const records = state.userRecords ?? {};
          const saved = records[userId] ?? EMPTY_QUIZ;
          return {
            activeUserId: userId,
            answers: saved.answers,
            currentStep: saved.currentStep,
            completed: saved.completed,
          };
        }),

      clearActiveSession: () =>
        set({
          activeUserId: null,
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

      complete: () =>
        set((state) =>
          buildUpdatedState(state, {
            completed: true,
          })
        ),
    }),
    {
      name: 'dervora_quiz',
      partialize: (state) => ({
        userRecords: state.userRecords,
      }),
    }
  )
);