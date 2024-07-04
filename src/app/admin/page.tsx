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
      <div className="w-64 bg-primaryLight dark:bg-dark-secondary-gradient text-white flex flex-col z-20">
        <div className="flex items-center justify-center h-16 border-b border-gray-700 z-20">
          <span className="text-xl font-semibold z-20">Admin</span>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 z-20">
          <div className="bg-primaryLight dark:bg-dark-secondary-gradient">
            <Sheet>
              <SheetTrigger>Produto</SheetTrigger>
              <SheetContent
                side="right"
                size="extraLarge"
                className=" bg-white dark:bg-gray-800"
              >
                <SheetHeader>
                  <SheetTitle>Are you absolutely sure?</SheetTitle>
                  <SheetDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>

      <main className="flex-1 p-8 bg-primaryLight dark:bg-dark-secondary-gradient z-20  ">
        <h1 className="text-2xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="mt-4 text-gray-600">
          Bem vindo a area de Adm do Site Stylos
        </p>
      </main>
    </div>
  );
};

export default AdminPage;
