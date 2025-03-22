'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import Sidebar from '@/components/SideBar';
import ChatPrompt from '@/components/ChatPrompt';
import QuestionSelector from '@/components/QuestionSelector';
import QACards from '@/components/QACards';
import WelcomeScreen from '@/components/WelcomeScreen';
import { useGlobalError } from '@/context/GlobalErrorContext';

// const testQuestions = [
//   'Does the organization have a Quality manual?',
//   'Control of outsourced processes defined?',
//   'Does the quality manual contain or reference the documented procedures established for the QMS?',
//   'Does the Quality Manual include the scope of QMS including justification of exclusions?',
//   'Does the Quality Manual Determine the sequence and interaction of these processes?',
//   'Is there a document control procedure?',
//   'Are documents identified with revision status and changes?',
//   'Are steps taken to ensure that relevant documents are available at point of use?',
//   'Are steps taken to ensure that the unintentional use of obsolete documents is prevented and that the latter are suitably identified?',
//   'Approval of the changes of documents by original approving function?',
//   'Does a procedure exist to control records?',
//   'Are records maintained to provide evidence of conformity?',
//   'Retention period of obsolete documents must be lifetime of the device or at least 2 years.',
//   'Is there a documented quality policy?',
//   'Are there established quality objectives?',
//   'Does the supplier conduct periodic management reviews?',
//   'Are management review records maintained?',
//   'Does the management review include customer feedback?',
//   'How are responsibilities and authority defined?',
//   'Has a management representative been appointed?',
//   'Are there adequate resources?',
//   'Is there a training procedure?',
//   'How have training needs been defined?',
//   'Are training records maintained?',
//   'Are the buildings, workspace, and utilities appropriate to meet product requirements?',
//   'Is there a preventive maintenance procedure?',
//   'Are preventive maintenance schedules and are records maintained?',
//   'Are their environmental controls established?',
//   'Are there procedures for customer contracts or orders?',
//   'Does the supplier have defined methods for customer communication, especially planned changes?',
//   'Are there procedures for design and development?',
//   'Are project plans used?',
//   'Are the records of design and development maintained, e.g. DHF?',
//   'Have design inputs been defined and documented?',
//   'Is risk analysis performed per ISO14971?',
//   'Have design outputs been defined and documented?',
//   'Have design reviews been defined, conducted, and documented?',
//   'Has design verification been performed?',
//   'Has design validation been performed?',
//   'Are design changes documented?',
//   'Are there procedures for design transfer?',
//   'Are there purchasing procedures established?',
//   'Are procedures established to select and re-evaluate suppliers?',
//   'Are requirements defined for purchased product, services, and equipment?',
//   'Are there procedures for the acceptance of incoming product?',
//   'Are manufacturing procedures and work instructions established?',
//   'Is equipment suitable for use and qualified prior to use?',
//   'Are there workmanship standards in use?',
//   'Does the supplier perform installation activities?',
//   'Does the supplier perform service activities?',
//   'Does the supplier perform sterile processing?',
//   'Does the supplier have any automated processes?',
//   'Does the supplier have in-process controls?',
//   'Are device master records established and maintained?',
//   'Are device history records established?',
//   'If a process cannot be fully verified, has the process been validated?',
//   'Are there procedures for identification and traceability?',
//   'Are products identified during all stages of manufacturing?',
//   'Does the supplier work with customer property?',
//   'Are procedures established for labeling of the product, including inspection, storage, integrity, and operations, and control numbers?',
//   'Are procedures established for storage, packaging and handling of product?',
//   'Are there procedures for the distribution of product?',
//   'Are there procedures for the control of monitoring and measuring devices?',
//   'Are devices calibrated at specified intervals?',
//   'Are devices identified as to their calibration status?',
//   'Are devices safeguarded from adjustments and protected from damage?',
//   'Are calibration records maintained?',
//   'Is there a process for handling for out-of-tolerance situations?',
//   'Are appropriate reference standards in use?',
//   'Does the supplier use gages that meet the 10:1 accuracy rule?',
//   'Appropriate statistical methods in use?',
//   'Is there a customer feedback (Complaint) procedure implemented?',
//   'Are complaints documented, investigated, the root cause identified, and reported, e.g. MDR, MDV?',
//   'Is a recall procedure established?',
//   'Is there an internal audit procedure established?',
//   'Are the results of previous audits taken into account?',
//   'How are internal auditors qualified?',
//   'Are the audits objective and impartial?',
//   'Is the frequency of audits sufficient based on the QMS?',
//   'Are nonconforming product identified, segregated, controlled, corrected, and investigated?',
//   'Is a rework procedure in use?',
//   'Is there a procedure to document the analysis of quality data?',
//   'Are the results of the analysis of quality data maintained?',
//   'Does the analysis of quality data include feedback, product conformance, trend analysis, and suppliers?',
//   'Is there a documented procedure established to define the requirements for corrective and preventive action?',
//   'Does the supplier review nonconformities, conduct and investigation, conduct root cause analysis, and take appropriate corrective or preventive action?',
//   'Are corrective actions trended?',
//   'Are corrective and preventive actions reviewed for effectiveness?',
// ];

// const testChatData = [
//   {
//     id: 0,
//     question: 'What is the capital of France?',
//     answer: 'Paris',
//   },
//   {
//     id: 1,
//     question: 'Who is the president of the United States?',
//     answer: 'Joe Biden',
//   },
//   {
//     id: 2,
//     question: 'What is the largest planet in our solar system?',
//     answer: 'Jupiter',
//   },
//   {
//     id: 3,
//     question: 'What is the capital of France?',
//     answer: 'Paris',
//   },
//   {
//     id: 4,
//     question: 'Who is the president of the United States?',
//     answer: 'Joe Biden',
//   },
//   {
//     id: 5,
//     question: 'What is the largest planet in our solar system?',
//     answer: 'Jupiter',
//   },
//   {
//     id: 6,
//     question: 'What is the capital of France?',
//     answer: 'Paris',
//   },
//   {
//     id: 7,
//     question: 'Who is the president of the United States?',
//     answer: 'Joe Biden',
//   },
//   {
//     id: 8,
//     question: 'What is the largest planet in our solar system?',
//     answer: 'Jupiter',
//   },
//   {
//     id: 9,
//     question: 'What is the capital of France?',
//     answer: 'Paris',
//   },
//   {
//     id: 10,
//     question: 'Who is the president of the United States?',
//     answer: 'Joe Biden',
//   },
//   {
//     id: 11,
//     question: 'What is the largest planet in our solar system?',
//     answer: 'Jupiter',
//   },
// ];

export default function Home() {
  const { data: session, status } = useSession();

  const { showError } = useGlobalError();

  const [input, setInput] = useState('');
  const [qaList, setQaList] = useState<{ question: string; answer: string }[]>(
    []
  );

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [questions, setQuestions] = useState<string[] | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
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

  // useEffect(() => {
  //   if (testQuestions && testQuestions.length > 0) {
  //     setQuestions(testQuestions);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (testChatData && testChatData.length > 0) {
  //     setQaList(testChatData);
  //   }
  // }, []);

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
