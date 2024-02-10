import type { Metadata } from 'next';

import './globals.css';

import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stylos Lingerie',
  description: 'A sua loja online de roupas intimas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR'>
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
