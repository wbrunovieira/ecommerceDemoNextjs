"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Color {
  _id: {
    value: string;
  };
  props: {
    name: string;
    hex: string;
    erpId: string;
  };
}
const AdminPage: React.FC = () => {
  const router = useRouter();

  const { data: session, status } = useSession();
  const [colors, setColors] = useState<Color[]>([]);
  const [editingColorId, setEditingColorId] = useState<string | null>(null);
  const [editColorData, setEditColorData] = useState({ name: "", hex: "" });
  console.log('colors',colors)
  

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.email !== "admin@example.com"
    ) {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        console.log('entrou no fech colors')
        console.log('entrou no fech colors', )
        const base_url = process.env.BASE_URL_BACKEND
        console.log('base_url',base_url)
        const response = await axios.get(`http://localhost:3333/colors/all?page=1&pageSize=10`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('response.data.colors',response.data.colors)
        setColors(response.data.colors);
      } catch (error) {
        console.error("Erro ao buscar as cores: ", error);
      }
    };

    fetchColors();
  }, []);

  const handleEditClick = (color: Color) => {
    setEditingColorId(color._id.value);
    setEditColorData({ name: color.props.name, hex: color.props.hex });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditColorData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSaveClick = async (colorId: string) => {
    try {
      await axios.put(
        `http://localhost:3333/colors/${colorId}`,
        { name: editColorData.name, hex: editColorData.hex },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken}`
          }
        }
      );
      setColors(prevColors => prevColors.map(color => 
        color._id.value === colorId ? { ...color, props: { ...color.props, ...editColorData } } : color
      ));
      setEditingColorId(null);
    } catch (error) {
      console.error("Erro ao salvar a cor: ", error);
    }
  };

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


   <div className="bg-primaryLight dark:bg-primaryDark p-2 rounded">
            <Sheet>
              <SheetTrigger>Cores</SheetTrigger>
              <SheetContent side="right" size="extraLarge">
                <SheetHeader>
                  <SheetTitle>Cor</SheetTitle>
                  <SheetDescription>Cor Descrição</SheetDescription>
                </SheetHeader>
                <div className="p-4">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-primaryLight dark:bg-primaryDark rounded">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">Nome</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">Hex</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">ERP ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-primaryLight dark:bg-primaryDark divide-y divide-gray-200 dark:divide-gray-700">
                      {colors.map((color) => (
                        <tr key={color._id.value}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{color._id.value}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                            {editingColorId === color._id.value ? (
                              <input
                                type="text"
                                name="name"
                                value={editColorData.name}
                                onChange={handleInputChange}
                                className="px-2 py-1 border border-gray-300 rounded"
                              />
                            ) : (
                              color.props.name
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                            {editingColorId === color._id.value ? (
                              <input
                                type="text"
                                name="hex"
                                value={editColorData.hex}
                                onChange={handleInputChange}
                                className="px-2 py-1 border border-gray-300 rounded"
                              />
                            ) : (
                              color.props.hex
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{color.props.erpId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                            {editingColorId === color._id.value ? (
                              <button
                                onClick={() => handleSaveClick(color._id.value)}
                                className="px-4 py-2 bg-secondary dark:bg-primarytext-white rounded"
                              >
                                Salvar
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEditClick(color)}
                                className="px-4 py-2 bg-primary dark:bg-primary text-white rounded"
                              >
                                Editar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
