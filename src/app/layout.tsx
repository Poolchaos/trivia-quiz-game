import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Trivia Quiz Game',
  description: 'Test your knowledge with our fun trivia questions!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-gray-50 min-h-screen`}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold text-primary-600">Trivia Quiz</h1>
            </div>
          </header>
          
          {children}
          
          <footer className="mt-auto py-6 bg-white border-t">
            <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} Trivia Quiz Game. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}