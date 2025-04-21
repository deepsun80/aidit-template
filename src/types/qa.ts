// types/qa.ts

export type QA = {
  question: string;
  answer: string;
};

export type QAQuestion = {
  question: string;
  reference?: string;
};

export type QAReport = {
  auditId: string;
  customer: string;
  date: string;
  questions: QAQuestion[] | null;
  selectedQuestions: string[];
  qaList: QA[];
  selectedFile: File | null;
};
