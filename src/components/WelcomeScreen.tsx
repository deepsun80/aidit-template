// components/WelcomeScreen.tsx
'use client';

interface WelcomeScreenProps {
  questions?: { question: string; reference?: string }[] | null;
  onOpenChat: () => void;
  onUploadClick: () => void;
  onViewQuestions: () => void;
}

export default function WelcomeScreen({
  questions,
  onOpenChat,
  onUploadClick,
  onViewQuestions,
}: WelcomeScreenProps) {
  return (
    <div className='text-center text-gray-700 text-lg space-y-6'>
      <p className='text-4xl text-center text-gray-900 mb-12 mt-4'>
        Welcome to <span className='font-bold'>Ai.Dit</span>
      </p>

      <p>
        You currently do not have any <strong>Stored Responses</strong>.
      </p>

      {questions && questions.length > 0 ? (
        <>
          <p>
            Select{' '}
            <span className='text-gray-800 font-semibold'>
              View Uploaded Questions
            </span>
            , choose which questions you&apos;d like to add to your{' '}
            <strong>Audit Stored Responses</strong>, and hit{' '}
            <span className='text-gray-800 font-semibold'>Submit</span>.
          </p>
          <div className='flex justify-center mt-4'>
            <button
              onClick={onViewQuestions}
              className='bg-gray-800 text-white px-6 py-2 rounded-sm hover:bg-gray-700 transition'
            >
              View Uploaded Questions
            </button>
          </div>
        </>
      ) : (
        <>
          <p>
            <span className='text-gray-900 font-medium'>Get started by:</span>
          </p>
          <div className='flex justify-center gap-4'>
            <button
              onClick={onOpenChat}
              className='bg-gray-800 text-white px-6 py-2 rounded-sm hover:bg-gray-700 transition'
            >
              Ask a Question
            </button>
            <button
              onClick={onUploadClick}
              className='bg-gray-800 text-white px-6 py-2 rounded-sm hover:bg-gray-700 transition'
            >
              Upload a Questionnaire
            </button>
          </div>
        </>
      )}
    </div>
  );
}
