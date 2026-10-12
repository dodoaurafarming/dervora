import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuizState {
  answers: Record<string, string | string[]>;
  currentStep: number;
  completed: boolean;

  setAnswer: (questionId: string, value: string | string[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
  complete: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      answers: {},
      currentStep: 0,
      completed: false,

      setAnswer: (questionId, value) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: value,
          },
        })),

      nextStep: () =>
        set((state) => ({
          currentStep: state.currentStep + 1,
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(0, state.currentStep - 1),
        })),

      goToStep: (step) => set({ currentStep: step }),

      reset: () =>
        set({
          answers: {},
          currentStep: 0,
          completed: false,
        }),

      complete: () => set({ completed: true }),
    }),
    {
      name: 'dervora_quiz',
    }
  )
);