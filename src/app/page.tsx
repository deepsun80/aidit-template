'use client';

import { useState, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import Sidebar from '@/components/SideBar';
import ChatPrompt from '@/components/ChatPrompt';
import QuestionSelector from '@/components/QuestionSelector';
import QACards from '@/components/QACards';
import WelcomeScreen from '@/components/WelcomeScreen';
import { useGlobalError } from '@/context/GlobalErrorContext';
import { useQA } from '@/context/QAContext';

export default function Home() {
  const { data: session, status } = useSession();

  const { showError } = useGlobalError();

  const { qaList, setQaList, questions, setQuestions } = useQA();
  const { selectedQuestions, setSelectedQuestions } = useQA();

  const [input, setInput] = useState('');
  // const [qaList, setQaList] = useState<{ question: string; answer: string }[]>(
  //   []
  // );

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  // const [questions, setQuestions] = useState<string[] | null>(null);
  // const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState<number | null>(
    null
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    for (let i = 0; i < selectedQuestions.length; i++) {
      const question = selectedQuestions[i];
      // Check if this question already exists in qaList
      const exists = qaList.some((qa) => qa.question === question);
      if (exists) {
        console.log(`Skipping duplicate question: ${question}`);
        continue; // Skip if already present
      }

      console.log('Processing query:', question);

      await processQuery(question);
      setSubmissionProgress(i + 1);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
    }

    setSubmissionProgress(null);

    setShowQuestionSelector(false);
    setLoading(false);
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
          <span className='mt-2 text-gray-700 text-sm'>
            Processing{' '}
            {submissionProgress !== null &&
              `${submissionProgress} / ${selectedQuestions.length}`}
            ...
          </span>
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
          <QACards
            qaList={qaList}
            onEdit={handleEditAnswer}
            onDelete={handleDeleteAnswer}
          />
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
