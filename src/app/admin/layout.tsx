import type { Metadata } from "next";


import "../globals.css";

import { Montserrat } from "next/font/google";


import { ThemeProvider } from "@/components/theme-provider";
import HeaderAdmin from "@/components/HeaderAdmin";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Panel - Stylos Lingerie",
  description: "Painel administrativo da loja online de roupas intimas.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={montserrat.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <HeaderAdmin />
          
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
