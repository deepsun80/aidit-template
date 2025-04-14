'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type QA = {
  question: string;
  answer: string;
};

export type QAQuestion = { question: string; reference?: string };

export type QAReport = {
  auditId: string;
  customer: string;
  date: string;
  questions: QAQuestion[] | null;
  selectedQuestions: string[];
  qaList: QA[];
  selectedFile: File | null;
};

type QAContextType = {
  report: QAReport | null;
  setReport: (report: QAReport | null) => void;
  updateReport: (partial: Partial<QAReport>) => void;
  deleteQuestions: () => void;
};

const QAContext = createContext<QAContextType | undefined>(undefined);

export const QAProvider = ({ children }: { children: React.ReactNode }) => {
  const [report, setReport] = useState<QAReport | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('qa-report');
    if (stored) setReport(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (report) {
      localStorage.setItem('qa-report', JSON.stringify(report));
    } else {
      localStorage.removeItem('qa-report');
    }
  }, [report]);

  const updateReport = (partial: Partial<QAReport>) => {
    setReport((prev) => (prev ? { ...prev, ...partial } : null));
  };

  const deleteQuestions = () => {
    setReport((prev) =>
      prev
        ? {
            ...prev,
            questions: null,
            selectedQuestions: [],
            selectedFile: null,
          }
        : null
    );
  };

  return (
    <QAContext.Provider
      value={{ report, setReport, updateReport, deleteQuestions }}
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
