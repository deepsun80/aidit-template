'use client';

import { useState, useRef, useEffect } from 'react';
import ChatPrompt from '@/components/ChatPrompt';
import QuestionSelector from '@/components/QuestionSelector';
import QACards from '@/components/QACards';
import NonconformityReport from '@/components/NonconformityReport';
import WelcomeScreen from '@/components/WelcomeScreen';
import CreateReport from '@/components/CreateReport';
import type { QAReport } from '@/types/qa';
import jsPDF from 'jspdf';

interface AuditManagementProps {
  report: QAReport | null;
  setReport: (report: QAReport | null) => void;
  updateReport: (partial: Partial<QAReport>) => void;
  deleteQuestions: () => void;
  showError: (message: string) => void;
}

export default function AuditManagement({
  report,
  setReport,
  updateReport,
  deleteQuestions,
  showError,
}: AuditManagementProps) {
  const [hasMounted, setHasMounted] = useState(false); // For Next.js hydration mismatch or flicker fix
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showQuestionSelector, setShowQuestionSelector] = useState(true);
  const [submissionProgress, setSubmissionProgress] = useState<number | null>(
    null
  );
  const [showCancel, setShowCancel] = useState(false);
  const [showOnlyNotFound, setShowOnlyNotFound] = useState(false);
  const [showNonconformityReport, setShowNonconformityReport] = useState(false);

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

  const processQuery = async (query: string) => {
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (data.answer && report) {
        updateReport({
          qaList: [
            ...(report.qaList || []),
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
    if (!qaList || qaList.length === 0 || !report) return;

    const doc = new jsPDF();
    const margin = 10;
    const maxWidth = 180;
    let y = margin;

    // === Add Audit Metadata Header ===
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Audit ID: ${report.auditId}`, margin, y);
    y += 8;
    doc.text(`Requesting Entity: ${report.customer}`, margin, y);
    y += 8;
    doc.text(`Requested Date: ${report.date}`, margin, y);
    y += 8; // add some extra space before Q/A items

    // === Loop through Q/A items ===
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
        6 + // space for divider + gap below
        wrappedQuestion.length * 6 +
        (referenceText ? wrappedReference.length * 6 + 2 : 0) +
        wrappedAnswer.length * 6 +
        (citationLine ? wrappedCitation.length * 6 + 2 : 0) +
        2; // bottom spacing

      if (y + requiredHeight > 280) {
        doc.addPage();
        y = margin;
      }

      // Divider line
      doc.setDrawColor(200);
      doc.setLineWidth(0.5);
      doc.line(margin, y, 200, y);
      y += 8; // ↑ add space after divider, before question

      // Question
      doc.setFont('helvetica', 'bold');
      doc.text(wrappedQuestion, margin, y);
      y += wrappedQuestion.length * 6;

      // Reference
      if (referenceText) {
        doc.setFont('helvetica', 'italic');
        doc.text(wrappedReference, margin, y);
        y += wrappedReference.length * 6 + 1;
      }

      // Answer
      doc.setFont('helvetica', 'normal');
      doc.text(wrappedAnswer, margin, y);
      y += wrappedAnswer.length * 6;

      // Citation
      if (citationLine) {
        doc.setFont('helvetica', 'italic');
        doc.text(wrappedCitation, margin, y);
        y += wrappedCitation.length * 6;
      }
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

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className='fixed top-0 left-0 w-full h-full bg-gray-100 bg-opacity-75 flex flex-col items-center justify-center z-50'>
        <div className='w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin'></div>
        <span className='mt-2 text-gray-700 text-sm text-center px-4'>
          Initializing...
        </span>
      </div>
    );
  }

  return (
    <>
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
              className='mt-4 px-4 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition'
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

      {!report ? (
        <CreateReport setReport={setReport} />
      ) : showQuestionSelector && questions ? (
        <QuestionSelector
          selectedFile={selectedFile?.name}
          questions={questions}
          setQuestions={(q) => updateReport({ questions: q })}
          onSelectionChange={(sq) => updateReport({ selectedQuestions: sq })}
          onCancel={() => {
            if (qaList.length > 0) setShowQuestionSelector(false);
          }}
          onSubmit={handleSubmitQuestions}
          disableCancel={qaList.length === 0}
          deleteQuestions={deleteQuestions}
        />
      ) : qaList.length > 0 ? (
        showNonconformityReport ? (
          <NonconformityReport
            qaList={qaList}
            notFoundCount={notFoundCount || 0}
            onBack={() => setShowNonconformityReport(false)}
            auditId={report?.auditId || 'N/A'}
            customer={report?.customer || 'N/A'}
            date={report?.date || 'N/A'}
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
            report={report!}
            onAskNew={() => setShowChat(true)}
            onUploadNew={() => fileInputRef.current?.click()}
            onViewUploaded={() => setShowQuestionSelector(true)}
            hasUploadedQuestions={(report?.questions?.length || 0) > 0}
          />
        )
      ) : (
        <WelcomeScreen
          report={report}
          onOpenChat={() => setShowChat(true)}
          onUploadClick={() => fileInputRef.current?.click()}
        />
      )}

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
    </>
  );
}
