"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import React, { useEffect } from "react";

const AdminPage: React.FC = () => {
  const router = useRouter();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.email !== "admin@example.com"
    ) {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Carregando...</div>;
  }

  if (session?.user?.email !== "admin@example.com") {
    return null;
  }

  return (
    <div className="flex min-h-screen z-20">
      <div className="w-64 bg-primaryLight dark:bg-primaryDark text-primaryDark dark:text-primaryLight  flex flex-col z-20">
        <div className="flex items-center justify-center h-16 border-b border-gray-700 z-20">
          <span className="text-xl text-primaryDark dark:text-primaryLight font-semibold z-20">Admin</span>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-4 z-20">
          <div className="bg-primaryLight dark:bg-primaryDark p-2 rounded">
            <Sheet>
              <SheetTrigger>Produto</SheetTrigger>
              <SheetContent
                side="right"
                // size="extraLarge"
                
              >
                <SheetHeader>
                  <SheetTitle>Produto</SheetTitle>
                  <SheetDescription>
                    Descricao do produto
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>

          <div className="bg-primaryLight dark:bg-primaryDark  p-2 rounded">
            <Sheet>
              <SheetTrigger>Categoria</SheetTrigger>
              <SheetContent
                side="right"
                size="extraLarge"
               
              >
                <SheetHeader>
                  <SheetTitle>Categoria</SheetTitle>
                  <SheetDescription>
                    Categoria Descricao
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          <div className="bg-primaryLight dark:bg-primaryDark  p-2 rounded">
            <Sheet>
              <SheetTrigger>Cor</SheetTrigger>
              <SheetContent
                side="right"
                size="extraLarge"
               
              >
                <SheetHeader>
                  <SheetTitle>Cor</SheetTitle>
                  <SheetDescription>
                    Cor Descricao
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          <div className="bg-primaryLight dark:bg-primaryDark  p-2 rounded">
            <Sheet>
              <SheetTrigger>Tamanho</SheetTrigger>
              <SheetContent
                side="right"
                size="extraLarge"
               
              >
                <SheetHeader>
                  <SheetTitle>Tamanho</SheetTitle>
                  <SheetDescription>
                  Tamanho Descricao
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          <div className="bg-primaryLight dark:bg-primaryDark  p-2 rounded">
            <Sheet>
              <SheetTrigger>Fabricante</SheetTrigger>
              <SheetContent
                side="right"
                size="extraLarge"
               
              >
                <SheetHeader>
                  <SheetTitle>Fabricante</SheetTitle>
                  <SheetDescription>
                  Fabricante Descricao
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>

      <main className="flex-1 p-8 bg-primaryLight dark:bg-primaryDark z-20  ">
        <h1 className="text-2xl text-primaryDark dark:text-primaryLight font-semibold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="mt-4 text-primaryDark dark:text-primaryLight">
          Bem vindo a area de Adm do Site Stylos
        </p>
      </main>
    </div>
  );
};

export default AdminPage;
