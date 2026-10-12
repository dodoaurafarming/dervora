import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useQuizStore } from '../../store/quizStore';
import { ALL_QUESTIONS, TOTAL_QUESTIONS, CATEGORY_LABELS } from '../../data/quizData';
import { QuizProgressBar } from '../../components/quiz/QuizProgressBar';
import { QuizOption } from '../../components/quiz/QuizOption';
import { Button } from '../../components/ui/Button';

export const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { answers, currentStep, setAnswer, nextStep, prevStep, complete } = useQuizStore();

  const currentQuestion = ALL_QUESTIONS[currentStep];
  const isLastStep = currentStep === TOTAL_QUESTIONS - 1;
  const currentAnswer = answers[currentQuestion?.id];

  const handleSingleSelect = (value: string) => {
    setAnswer(currentQuestion.id, value);
  };

  const handleMultipleSelect = (value: string) => {
    const current = (currentAnswer as string[]) || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setAnswer(currentQuestion.id, next);
  };

  const handleNext = () => {
    if (isLastStep) {
      complete();
      navigate('/skin-profile');
    } else {
      nextStep();
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      navigate('/');
    } else {
      prevStep();
    }
  };

  const isCurrentAnswered = () => {
    if (currentQuestion.type === 'single') {
      return !!currentAnswer;
    }
    return Array.isArray(currentAnswer) && currentAnswer.length > 0;
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-dervora-cream flex items-center justify-center">
        <p className="font-heading italic text-xl text-dervora-dark/60">Memuat quiz...</p>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen bg-dervora-cream py-8 md:py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 font-body text-sm text-dervora-dark/70 hover:text-dervora-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          {currentStep === 0 ? 'Kembali ke Home' : 'Pertanyaan Sebelumnya'}
        </button>

        {/* Progress Bar */}
        <QuizProgressBar current={currentStep + 1} total={TOTAL_QUESTIONS} />

        {/* Category Label */}
        <div className="mt-6 mb-2">
          <span className="inline-block px-3 py-1 bg-dervora-blush/40 text-dervora-primary font-body text-xs uppercase tracking-wider rounded-full">
            {CATEGORY_LABELS[currentQuestion.category]}
          </span>
        </div>

        {/* Question */}
        <h1 className="font-heading text-2xl md:text-4xl font-bold text-dervora-primary leading-tight mt-3 mb-6">
          {currentQuestion.question}
        </h1>

        {/* Hint for multiple */}
        {currentQuestion.type === 'multiple' && (
          <p className="font-body text-sm text-dervora-dark/60 italic mb-4">
            Boleh memilih lebih dari satu.
          </p>
        )}

        {/* Options */}
        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option) => {
            const isSelected =
              currentQuestion.type === 'single'
                ? currentAnswer === option.value
                : Array.isArray(currentAnswer) && currentAnswer.includes(option.value);

            return (
              <QuizOption
                key={option.value}
                label={option.label}
                selected={isSelected}
                onClick={() =>
                  currentQuestion.type === 'single'
                    ? handleSingleSelect(option.value)
                    : handleMultipleSelect(option.value)
                }
              />
            );
          })}
        </div>

        {/* Next Button */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            size="lg"
            onClick={handleNext}
            disabled={!isCurrentAnswered()}
            className="whitespace-nowrap"
          >
            {isLastStep ? 'Lihat Hasil' : 'Selanjutnya'}
            <ArrowRight size={18} className="inline ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};