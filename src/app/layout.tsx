import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import './globals.css';

import { Montserrat } from 'next/font/google';

import Container from '@/components/Container';
import Sidebar from '@/components/SideBar';
import ProductList from '@/components/ProductList';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

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
      <body className={montserrat.className}>
        <Header />

        {children}

        <Footer />
      </body>
    </html>
  );
}
