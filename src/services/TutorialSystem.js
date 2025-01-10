import { create } from 'zustand';

const TUTORIAL_STEPS = {
  WELCOME: {
    id: 'welcome',
    title: 'Welcome to AWS Architecture Challenge!',
    content: 'Learn AWS services by building architectures.',
    position: 'center'
  },
  SERVICES: {
    id: 'services',
    title: 'AWS Services',
    content: 'Drag and drop services to build your architecture.',
    position: 'right'
  },
  VALIDATION: {
    id: 'validation',
    title: 'Validation',
    content: 'The AI will validate your architecture choices.',
    position: 'bottom'
  }
};

export const useTutorialStore = create((set) => ({
  currentStep: null,
  completed: false,
  setStep: (step) => set({ currentStep: step }),
  completeStep: () => set((state) => {
    const steps = Object.keys(TUTORIAL_STEPS);
    const currentIndex = steps.indexOf(state.currentStep);
    const nextStep = steps[currentIndex + 1];
    return {
      currentStep: nextStep || null,
      completed: !nextStep
    };
  })
})); 