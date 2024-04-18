import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

import './globals.css';

import { Montserrat } from 'next/font/google';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import AuthProvider from '@/components/AuthProvider';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stylos Lingerie',
  description: 'A sua loja online de roupas intimas.',
};

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session?: Session;
}>) {
  return (
    <AuthProvider>
      <html lang='pt-BR'>
        <body className={montserrat.className}>
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
}
