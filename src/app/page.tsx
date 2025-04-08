'use client';

import { useState, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import Sidebar from '@/components/SideBar';
import Header from '@/components/Header';
import ChatPrompt from '@/components/ChatPrompt';
import QuestionSelector from '@/components/QuestionSelector';
import QACards from '@/components/QACards';
import NonconformityReport from '@/components/NonconformityReport';
import WelcomeScreen from '@/components/WelcomeScreen';
import CreateReport from '@/components/CreateReport';
import { useGlobalError } from '@/context/GlobalErrorContext';
import { useQA } from '@/context/QAContext';
import jsPDF from 'jspdf';
import { QA } from '@/context/QAContext';

export default function Home() {
  const { data: session, status } = useSession();
  const { showError } = useGlobalError();
  const { report, setReport, updateReport } = useQA();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState<number | null>(
    null
  );
  const [showCancel, setShowCancel] = useState(false);
  const [showOnlyNotFound, setShowOnlyNotFound] = useState(false);
  const [showNonconformityReport, setShowNonconformityReport] = useState(false);
  const [createReport, setCreateReport] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cancelRequestedRef = useRef(false);

  const qaList = report?.qaList || [];
  const questions = report?.questions || null;
  const selectedQuestions = report?.selectedQuestions || [];
  const selectedFile = report?.selectedFile || null;

  const notFoundCount = qaList.filter((qa) =>
    qa.answer
      .trim()
      .split('\n')
      .at(-1)
      ?.toLowerCase()
      .includes('found in context: false')
  ).length;

  const handleSubmitChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !report) return;
    setLoading(true);

    const exists = qaList.some((qa) => {
      const [qText] = qa.question.split(' - ');
      return qText.trim() === input.trim();
    });

    if (exists) {
      console.log(`Skipping duplicate chat question: ${input}`);
      setLoading(false);
      return;
    }

    await processQuery(input);
    setShowChat(false);
    setLoading(false);
  };

  const handleSubmitQuestions = async () => {
    if (!report || selectedQuestions.length === 0) return;

    setLoading(true);
    setSubmissionProgress(0);
    cancelRequestedRef.current = false;

    let currentQaList = [...qaList];

    for (let i = 0; i < selectedQuestions.length; i++) {
      if (cancelRequestedRef.current) {
        console.log('Cancellation triggered.');
        break;
      }

      const question = selectedQuestions[i];

      const exists = currentQaList.some(
        (qa) => qa.question.trim() === question.trim()
      );

      if (exists) {
        console.log(`Skipping duplicate question: ${question}`);
        continue;
      }

      console.log('Processing query:', question);

      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: question }),
      });

      const data = await res.json();

      if (data.answer) {
        const newQa = { question: data.question, answer: data.answer };
        currentQaList = [...currentQaList, newQa];
        updateReport({ qaList: currentQaList });
      }

      setSubmissionProgress(i + 1);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setSubmissionProgress(null);
    setLoading(false);
    setShowQuestionSelector(false);
    setShowCancel(false);
    cancelRequestedRef.current = false;
  };

  const processQuery = async (query: string, currentQaList: QA[] = []) => {
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (data.answer) {
        updateReport({
          qaList: [
            ...currentQaList,
            { question: data.question, answer: data.answer },
          ],
        });
      }
    } catch (error) {
      showError(`Error with query: ${error}`);
      console.error('Error with query:', error);
    }
  };

  const handleEditAnswer = (index: number, newAnswer: string) => {
    if (!report) return;
    const newQaList = [...qaList];
    newQaList[index] = { ...newQaList[index], answer: newAnswer };
    updateReport({ qaList: newQaList });
  };

  const handleDeleteAnswer = (index: number) => {
    if (!report) return;
    const newQaList = qaList.filter((_, i) => i !== index);
    updateReport({ qaList: newQaList });
  };

  const handleDownloadPDF = () => {
    if (!qaList || qaList.length === 0) return;

    const doc = new jsPDF();
    const margin = 10;
    const maxWidth = 180;
    let y = margin;

    qaList.forEach((qa, index) => {
      const [rawQuestion, rawReference] = qa.question.split(' - ');
      const questionText = `${index + 1}: ${rawQuestion.trim()}`;
      const wrappedQuestion = doc.splitTextToSize(questionText, maxWidth);
      const referenceText = rawReference
        ? `Standard Reference: ${rawReference.trim()}`
        : null;
      const wrappedReference = referenceText
        ? doc.splitTextToSize(referenceText, maxWidth)
        : [];
      const lines = qa.answer.split('\n');
      const citationLine = lines.find((line) =>
        line.toLowerCase().startsWith('cited from:')
      );
      const mainAnswerLines = lines.filter(
        (line) =>
          !line.toLowerCase().startsWith('cited from:') &&
          !line.toLowerCase().startsWith('found in context:')
      );
      const formattedAnswer = `A: ${mainAnswerLines.join('\n   ')}`;
      const wrappedAnswer = doc.splitTextToSize(formattedAnswer, maxWidth);
      const wrappedCitation = citationLine
        ? doc.splitTextToSize(citationLine, maxWidth)
        : [];
      const requiredHeight =
        wrappedQuestion.length * 6 +
        (referenceText ? wrappedReference.length * 6 + 2 : 0) +
        wrappedAnswer.length * 6 +
        (citationLine ? wrappedCitation.length * 6 + 2 : 0) +
        8;

      if (y + requiredHeight > 280) {
        doc.addPage();
        y = margin;
      }

      doc.setFont('helvetica', 'bold');
      doc.text(wrappedQuestion, margin, y);
      y += wrappedQuestion.length * 6;

      if (referenceText) {
        doc.setFont('helvetica', 'italic');
        doc.text(wrappedReference, margin, y);
        y += wrappedReference.length * 6 + 2;
      }

      doc.setFont('helvetica', 'normal');
      doc.text(wrappedAnswer, margin, y);
      y += wrappedAnswer.length * 6;

      if (citationLine) {
        doc.setFont('helvetica', 'italic');
        doc.text(wrappedCitation, margin, y);
        y += wrappedCitation.length * 6 + 2;
      }

      y += 6;
    });

    doc.save('audit_responses.pdf');
  };

  const handleFileSelect = async (file: File | null) => {
    if (!file || !report) return;
    setUploading(true);
    updateReport({ selectedFile: file });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.questions) {
        updateReport({ questions: data.questions });
        setShowQuestionSelector(true);
      } else {
        showError(data.error || 'Error processing file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      showError(`Error uploading file: ${error}`);
    } finally {
      setUploading(false);
    }
  };

  if (status === 'loading') {
    return <p className='text-center text-lg font-medium'>Loading...</p>;
  }

  if (!session) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <p className='text-md mb-4 text-gray-900'>
          You must be signed in to access this page.
        </p>
        <button
          onClick={() => signIn('google')}
          className='flex items-center px-6 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700'
        >
          <Image
            src='/google-logo.png'
            alt='Google Logo'
            width={20}
            height={20}
            className='mr-2'
          />
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 flex flex-row'>
      <Sidebar />
      <div className='flex flex-col flex-1'>
        <Header />
        {(loading || uploading) && (
          <div className='fixed top-0 left-0 w-full h-full bg-gray-100 bg-opacity-75 flex flex-col items-center justify-center z-50'>
            <div className='w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin'></div>
            <span className='mt-2 text-gray-700 text-sm text-center px-4'>
              {showCancel
                ? 'Cancelling...'
                : uploading
                ? `Processing ${selectedFile?.name ?? 'file'}...`
                : submissionProgress !== null
                ? `Processing ${submissionProgress} / ${selectedQuestions.length}...`
                : 'Processing...'}
            </span>
            {loading && (
              <button
                onClick={() => {
                  cancelRequestedRef.current = true;
                  setShowCancel(true);
                }}
                className='mt-4 px-4 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition'
                disabled={showCancel}
              >
                Cancel
              </button>
            )}
          </div>
        )}
        <input
          type='file'
          ref={fileInputRef}
          accept='.pdf'
          className='hidden'
          onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
        />
        <main className='flex-1 p-8'>
          {createReport ? (
            <CreateReport
              setReport={setReport}
              onCancel={() => setCreateReport(false)}
            />
          ) : showQuestionSelector && questions ? (
            <QuestionSelector
              selectedFile={selectedFile?.name}
              questions={questions}
              setQuestions={(q) => updateReport({ questions: q })}
              onSelectionChange={(sq) =>
                updateReport({ selectedQuestions: sq })
              }
              onCancel={() => setShowQuestionSelector(false)}
              onSubmit={handleSubmitQuestions}
            />
          ) : qaList.length > 0 ? (
            showNonconformityReport ? (
              <NonconformityReport
                qaList={qaList}
                notFoundCount={notFoundCount || 0}
                onBack={() => setShowNonconformityReport(false)}
              />
            ) : (
              <QACards
                qaList={qaList}
                notFoundCount={notFoundCount || 0}
                onEdit={handleEditAnswer}
                onDelete={handleDeleteAnswer}
                showOnlyNotFound={showOnlyNotFound}
                setShowOnlyNotFound={setShowOnlyNotFound}
                onDownload={handleDownloadPDF}
                onViewReport={() => setShowNonconformityReport(true)}
                reportTitle={report?.title || 'Untitled'}
                onAskNew={() => setShowChat(true)}
                onUploadNew={() => fileInputRef.current?.click()}
                onViewUploaded={() => setShowQuestionSelector(true)}
                hasUploadedQuestions={(report?.questions?.length || 0) > 0}
              />
            )
          ) : (
            <WelcomeScreen
              report={report}
              onCreateReport={() => setCreateReport(true)}
              onOpenChat={() => setShowChat(true)}
              onUploadClick={() => fileInputRef.current?.click()}
              onViewQuestions={() => setShowQuestionSelector(true)}
            />
          )}
        </main>
      </div>

      {showChat && (
        <div className='absolute top-0 left-0 w-full h-full bg-gray-100 bg-opacity-95 z-40 flex items-center justify-center'>
          <ChatPrompt
            input={input}
            onInputChange={setInput}
            onSubmit={handleSubmitChat}
            onCancel={() => setShowChat(false)}
          />
        </div>
      )}
    </div>
  );
}
