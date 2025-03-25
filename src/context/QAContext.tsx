'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type QAItem = {
  question: string;
  answer: string;
};

type QAContextType = {
  questions: string[] | null;
  setQuestions: React.Dispatch<React.SetStateAction<string[] | null>>;
  qaList: QAItem[];
  setQaList: React.Dispatch<React.SetStateAction<QAItem[]>>;
  selectedQuestions: string[];
  setSelectedQuestions: React.Dispatch<React.SetStateAction<string[]>>;
};

const QAContext = createContext<QAContextType | undefined>(undefined);

export const QAProvider = ({ children }: { children: React.ReactNode }) => {
  const [questions, setQuestionsState] = useState<string[] | null>(null);
  const [qaList, setQaListState] = useState<QAItem[]>([]);
  const [selectedQuestions, setSelectedQuestionsState] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedQuestions = localStorage.getItem('questions');
      const storedQaList = localStorage.getItem('qaList');
      const storedSelectedQuestions = localStorage.getItem('selectedQuestions');

      if (storedQuestions) {
        setQuestionsState(JSON.parse(storedQuestions));
      }

      if (storedQaList) {
        setQaListState(JSON.parse(storedQaList));
      }

      if (storedSelectedQuestions) {
        setSelectedQuestionsState(JSON.parse(storedSelectedQuestions));
      } else {
        setSelectedQuestionsState([]);
      }
    } catch (e) {
      console.error('Failed to load QA state from localStorage:', e);
    }
  }, []);

  // Persist to localStorage when values change
  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('qaList', JSON.stringify(qaList));
  }, [qaList]);

  useEffect(() => {
    localStorage.setItem(
      'selectedQuestions',
      JSON.stringify(selectedQuestions)
    );
  }, [selectedQuestions]);

  return (
    <QAContext.Provider
      value={{
        questions,
        setQuestions: setQuestionsState,
        qaList,
        setQaList: setQaListState,
        selectedQuestions,
        setSelectedQuestions: setSelectedQuestionsState,
      }}
    >
      {children}
    </QAContext.Provider>
  );
};

export const useQA = (): QAContextType => {
  const context = useContext(QAContext);
  if (!context) {
    throw new Error('useQA must be used within a QAProvider');
  }
  return context;
};
