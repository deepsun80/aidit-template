import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { getServerSession } from 'next-auth';
import SessionProvider from '@/components/SessionProvider'; // Create this file if it doesn't exist
import { GlobalErrorProvider } from '@/context/GlobalErrorContext';
import { QAProvider } from '@/context/QAContext';
import GlobalError from '@/components/GlobalError';

// Load Roboto font
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'], // Specify font weights (400 = Regular, 700 = Bold)
  variable: '--font-roboto', // Create a CSS variable for Tailwind use
});

export const metadata: Metadata = {
  title: 'Ai.Dit',
  description: 'A.I Audit Assistant',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <SessionProvider session={session}>
      <html lang='en' className={roboto.variable}>
        <body>
          <GlobalErrorProvider>
            <QAProvider>
              {children}
              <GlobalError />
            </QAProvider>
          </GlobalErrorProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
