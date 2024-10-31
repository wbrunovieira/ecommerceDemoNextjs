import type { Metadata } from 'next';

import './globals.css';

import { Montserrat } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

import NextAuthSessionProvider from '@/providers/sessionProvider';
import ClearCartOnLogout from '@/utils/ClearCartOnLogout';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Stylos Lingerie',
    description: 'A sua loja online de roupas intimas.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body className={montserrat.className}>
             
                    <NextAuthSessionProvider>
                        <Header />
                        <main>{children}</main>
                        <Toaster />
                        <Footer />
                        <ClearCartOnLogout />
                    </NextAuthSessionProvider>
              
            </body>
        </html>
    );
}
