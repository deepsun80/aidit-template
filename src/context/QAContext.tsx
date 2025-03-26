'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type QAItem = {
  question: string;
  answer: string;
};

type QAContextType = {
  questions: string[] | null;
  setQuestions: React.Dispatch<React.SetStateAction<string[] | null>>;
  deleteQuestions: () => void;
  qaList: QAItem[];
  setQaList: React.Dispatch<React.SetStateAction<QAItem[]>>;
  selectedQuestions: string[];
  setSelectedQuestions: React.Dispatch<React.SetStateAction<string[]>>;
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
};

const QAContext = createContext<QAContextType | undefined>(undefined);

export const QAProvider = ({ children }: { children: React.ReactNode }) => {
  const [questions, setQuestionsState] = useState<string[] | null>(null);
  const [qaList, setQaListState] = useState<QAItem[]>([]);
  const [selectedQuestions, setSelectedQuestionsState] = useState<string[]>([]);
  const [selectedFile, setSelectedFileState] = useState<File | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedQuestions = localStorage.getItem('questions');
      const storedQaList = localStorage.getItem('qaList');
      const storedSelectedQuestions = localStorage.getItem('selectedQuestions');
      const storedFile = localStorage.getItem('selectedFile');

      if (storedQuestions) {
        setQuestionsState(JSON.parse(storedQuestions));
      }

      if (storedQaList) {
        setQaListState(JSON.parse(storedQaList));
      }

      if (storedFile) {
        const parsed = JSON.parse(storedFile);
        const blob = new Blob([Uint8Array.from(parsed.data)], {
          type: parsed.type,
        });
        const file = new File([blob], parsed.name, { type: parsed.type });
        setSelectedFileState(file);
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

  // Delete questions
  const deleteQuestions = () => {
    setQuestionsState([]);
    setSelectedQuestionsState([]);
  };

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

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const byteArray = Array.from(new Uint8Array(arrayBuffer));
        localStorage.setItem(
          'selectedFile',
          JSON.stringify({
            name: selectedFile.name,
            type: selectedFile.type,
            data: byteArray,
          })
        );
      };
      reader.readAsArrayBuffer(selectedFile);
    } else {
      localStorage.removeItem('selectedFile');
    }
  }, [selectedFile]);

  return (
    <QAContext.Provider
      value={{
        questions,
        setQuestions: setQuestionsState,
        qaList,
        setQaList: setQaListState,
        selectedQuestions,
        setSelectedQuestions: setSelectedQuestionsState,
        deleteQuestions,
        selectedFile,
        setSelectedFile: setSelectedFileState,
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
