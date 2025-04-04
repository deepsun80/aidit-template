'use client';

import { useState, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import Sidebar from '@/components/SideBar';
import ChatPrompt from '@/components/ChatPrompt';
import QuestionSelector from '@/components/QuestionSelector';
import QACards from '@/components/QACards';
import NonconformityReport from '@/components/NonconformityReport';
import WelcomeScreen from '@/components/WelcomeScreen';
import { useGlobalError } from '@/context/GlobalErrorContext';
import { useQA } from '@/context/QAContext';
import jsPDF from 'jspdf';

export default function Home() {
  const { data: session, status } = useSession();

  const { showError } = useGlobalError();

  const {
    qaList,
    setQaList,
    questions,
    setQuestions,
    selectedQuestions,
    setSelectedQuestions,
    selectedFile,
    setSelectedFile,
  } = useQA();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState<number | null>(
    null
  );
  const [showCancel, setShowCancel] = useState(false); // Used only for Cancel UI
  const [showOnlyNotFound, setShowOnlyNotFound] = useState(false); // Used for Responses Not Found filter function
  const [showNonconformityReport, setShowNonconformityReport] = useState(false); // Toggle nonconformity report and QA Cards

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cancelRequestedRef = useRef(false); // Used for Cancel logic in handleSubmitQuestions

  // Not found items in qaList
  const notFoundCount = qaList.filter((qa) =>
    qa.answer
      .trim()
      .split('\n')
      .at(-1)
      ?.toLowerCase()
      .includes('found in context: false')
  ).length;

  // **Handle Chat Submission (Single Query)**
  const handleSubmitChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);

    // Check if the question already exists in qaList
    const exists = qaList.some((qa) => qa.question === input);
    if (exists) {
      console.log(`Skipping duplicate chat question: ${input}`);
      setLoading(false);
      return;
    }

    await processQuery(input);

    setShowQuestionSelector(false);
    setLoading(false);
    setShowChat(false);
  };

  // **Handle Multiple Question Submission**
  const handleSubmitQuestions = async () => {
    if (selectedQuestions.length === 0) return;

    setLoading(true);
    setSubmissionProgress(0);
    cancelRequestedRef.current = false;

    for (let i = 0; i < selectedQuestions.length; i++) {
      if (cancelRequestedRef.current) {
        console.log('Cancellation triggered.');
        break;
      }

      const question = selectedQuestions[i];
      // Check if this question already exists in qaList
      const exists = qaList.some((qa) => qa.question === question);
      if (exists) {
        console.log(`Skipping duplicate question: ${question}`);
        continue; // Skip if already present
      }

      const cleanQuestion = question.split(' - ')[0].trim();

      console.log('Processing query:', cleanQuestion);

      await processQuery(cleanQuestion);
      setSubmissionProgress(i + 1);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
    }

    setSubmissionProgress(null);
    setLoading(false);
    setShowQuestionSelector(false);
    setShowCancel(false);
    cancelRequestedRef.current = false;
  };

  // **Function to Process a Query**
  const processQuery = async (query: string) => {
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      console.log('Debugging Frontend Response:', data);

      if (data.answer) {
        setQaList((prev) => [
          ...prev,
          { question: data.question, answer: data.answer },
        ]);
      }
    } catch (error) {
      // setError('Something went wrong: ' + error);
      showError(`Error with query: ${error}`);
      console.error('Error with query:', error);
    }
  };

  // **Handle File Selection**
  const handleFileSelect = async (file: File | null) => {
    if (!file) return;

    setSelectedFile(file);
    setQuestions(null); // Reset extracted text
    setSelectedQuestions([]); // Reset selected questions

    console.log('Selected file:', file.name);

    await uploadFile(file);
  };

  // **Upload File to Backend**
  const uploadFile = async (file: File) => {
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
        setShowQuestionSelector(true);
      } else {
        // setError(data.error || 'Error processing file');
        showError(data.error || 'Error processing file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      // setError('Failed to upload file');
      showError(`Error uploading file: ${error}`);
    } finally {
      setUploading(false);
    }
  };

  // **Update answer for a given index**
  const handleEditAnswer = (index: number, newAnswer: string) => {
    setQaList((prev) =>
      prev.map((qa, i) => (i === index ? { ...qa, answer: newAnswer } : qa))
    );
  };

  // **Delete a Q/A pair from the list**
  const handleDeleteAnswer = (index: number) => {
    setQaList((prev) => prev.filter((_, i) => i !== index));
  };

  // **Download QAList as PDF**
  const handleDownloadPDF = () => {
    if (!qaList || qaList.length === 0) return;

    const doc = new jsPDF();
    const margin = 10;
    const maxWidth = 180;
    let y = margin;

    qaList.forEach((qa, index) => {
      // Split question and reference from qa.question
      const [rawQuestion, rawReference] = qa.question.split(' - ');
      const questionText = `${index + 1}: ${rawQuestion.trim()}`;
      const wrappedQuestion = doc.splitTextToSize(questionText, maxWidth);

      // Format reference if present
      const referenceText = rawReference
        ? `Standard Reference: ${rawReference.trim()}`
        : null;
      const wrappedReference = referenceText
        ? doc.splitTextToSize(referenceText, maxWidth)
        : [];

      // Separate answer/citation sections
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

      // --- Calculate required space ---
      const requiredHeight =
        wrappedQuestion.length * 6 +
        (referenceText ? wrappedReference.length * 6 + 2 : 0) +
        wrappedAnswer.length * 6 +
        (citationLine ? wrappedCitation.length * 6 + 2 : 0) +
        8; // extra spacing between QAs

      // --- Add new page if needed ---
      if (y + requiredHeight > 280) {
        doc.addPage();
        y = margin;
      }

      // --- Render Question ---
      doc.setFont('helvetica', 'bold');
      doc.text(wrappedQuestion, margin, y);
      y += wrappedQuestion.length * 6;

      // --- Render Reference ---
      if (referenceText) {
        doc.setFont('helvetica', 'italic');
        doc.text(wrappedReference, margin, y);
        y += wrappedReference.length * 6 + 2;
      }

      // --- Render Answer ---
      doc.setFont('helvetica', 'normal');
      doc.text(wrappedAnswer, margin, y);
      y += wrappedAnswer.length * 6;

      // --- Render Citation ---
      if (citationLine) {
        doc.setFont('helvetica', 'italic');
        doc.text(wrappedCitation, margin, y);
        y += wrappedCitation.length * 6 + 2;
      }

      // --- Extra space before next item ---
      y += 6;
    });

    doc.save('audit_responses.pdf');
  };

  // **Show loading state if session is still being checked**
  if (status === 'loading') {
    return <p className='text-center text-lg font-medium'>Loading...</p>;
  }

  // **Require authentication**
  if (!session) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <p className='text-md mb-4 text-gray-900 '>
          You must be signed in to access this page.
        </p>
        <button
          onClick={() => signIn('google')}
          className='flex items-center px-6 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700'
        >
          {/* Google Logo */}
          <Image
            src='/google-logo.png' // Or '/google-logo.svg' if using SVG
            alt='Google Logo'
            width={20} // Adjust size as needed
            height={20}
            className='mr-2' // Adds spacing between icon and text
          />
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <Sidebar
        onToggleChat={() => setShowChat((prev) => !prev)}
        onToggleQuestions={() => setShowQuestionSelector((prev) => !prev)}
        onUploadClick={() => fileInputRef.current?.click()}
        questions={questions}
      />

      {/* Loading Overlay */}
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

      {/* File Input (Hidden) */}
      <input
        type='file'
        ref={fileInputRef}
        accept='.pdf'
        className='hidden'
        onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
      />

      {/* Main Content Area */}
      <main className='ml-72 flex-1 p-8'>
        {/* Show Questions UI when questions are available */}
        {showChat && (
          <ChatPrompt
            input={input}
            onInputChange={setInput}
            onSubmit={handleSubmitChat}
            onCancel={() => setShowChat(false)}
          />
        )}
        {showQuestionSelector && questions ? (
          <QuestionSelector
            selectedFile={selectedFile?.name}
            questions={questions}
            setQuestions={setQuestions}
            onSelectionChange={setSelectedQuestions}
            onCancel={() => setShowQuestionSelector(false)}
            onSubmit={handleSubmitQuestions}
          />
        ) : qaList?.length > 0 ? (
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
            />
          )
        ) : (
          <WelcomeScreen
            questions={questions}
            onOpenChat={() => setShowChat(true)}
            onUploadClick={() => fileInputRef.current?.click()}
            onViewQuestions={() => setShowQuestionSelector(true)}
          />
        )}
      </main>
    </div>
  );
}
