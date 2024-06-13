"use client";

import Image from "next/image";
import Link from "next/link";

import PriceFilter from "./PriceFilter";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface SidebarProps {
  initialCategories: Category[];
}

const Sidebar: React.FC<SidebarProps> = ({ initialCategories }) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/category/all?page=1&pageSize=10`
        );
        const data = await res.json();
        
        const fetchedCategories = data.categories.map((category: any) => ({
          id: category.id,
          name: category.name,
          slug: category.slug || "/default-image.png",
        }));
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const sidebarItems = [
    { src: "/icons/lingerie-mini.svg", name: "Lingerie" },
    { src: "/icons/pijamas-mini.svg", name: "Pijamas" },
    { src: "/icons/moda-mini.svg", name: "Moda Fitness" },
    { src: "/icons/glasses-mini.svg", name: "Óculos" },
    { src: "/icons/bag-mini.svg", name: "Bolsas" },
    { src: "/icons/perfume-mini.svg", name: "Perfumes" },
    { src: "/icons/boy.svg", name: "Homens" },
  ];

  const sidebarFabricantes = [
    { src: "/icons/logo-liz.svg", title: "Liz" },
    { src: "/icons/logo-nayne.jpeg", title: "Nayane" },
  ];

  const color = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#FFE4C4",
    "#FFC0CB",
    "#000080",
    "#808080",
  ];

  const sizes = ["P", "M", "G", "GG"];

  return (
    <nav className="flex flex-col gap-2 mr-4">
      <div className="flex flex-col w-48 border border-light rounded p-4 mt-2">
        <h2 className="text-primaryDark text-base tracking-wider mb-2">
          Categorias
        </h2>

        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center py-1 border-b border-light"
          >
            <Link
              href={`/products/category/${category.id}`}
              className="flex items-center py-2 space-x-2"
            >
              <Image
                src={category.slug}
                width={20}
                height={20}
                alt={category.name}
                className="mr-2"
              />
              <div className="text-xs">{category.name}</div>
            </Link>
          </div>
        ))}
        <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4" />
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center py-1 ${
              index < sidebarItems.length - 1 ? "border-b border-light" : ""
            }`}
          >
            <Link href={item.name} className="flex items-center py-2 space-x-2">
              <Image
                src={item.src}
                width={20}
                height={20}
                alt={item.name}
                className="mr-2"
              ></Image>
              <div className="text-xs">{item.name}</div>
            </Link>
          </div>
        ))}
      </div>

      <div className="flex flex-col w-48 border border-light p-4 mt-2 rounded">
        <h2 className="text-primaryDark text-base tracking-wider rounded mb-2 ">
          Marcas
        </h2>
        <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4" />
        {sidebarFabricantes.map((item, index) => (
          <div
            key={index}
            className={`flex items-center py-1 ${
              index < sidebarItems.length - 1 ? "border-b border-light" : ""
            }`}
          >
            <Link
              href={item.title}
              className="flex items-center py-2 space-x-2"
            >
              <Image
                src={item.src}
                width={20}
                height={20}
                alt=""
                className="mr-2"
              ></Image>
              <div className="text-xs">{item.title}</div>
            </Link>
          </div>
        ))}
      </div>

      <div className="flex flex-col w-48 border border-light p-4 mt-2 rounded">
        <h2 className="text-primaryDark text-base tracking-wider rounded mb-2 ">
          Cores
        </h2>
        <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4" />
        <div className="flex gap-2 flex-wrap">
          {color.map((colorValue, index) => (
            <div
              key={index}
              className="w-6 h-6 rounded-full"
              style={{
                backgroundColor: colorValue,
                border: "1px solid #ddd",
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="flex flex-col w-48 border border-light p-4 mt-2 rounded">
        <h2 className="text-primaryDark text-base tracking-wider rounded mb-2 ">
          Tamanhos
        </h2>
        <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4" />
        <div className="flex gap-2 justify-start p-2 w-16">
          {sizes.map((sizeValue, index) => (
            <div
              key={index}
              className="border border-light rounded p-2 text-xs"
            >
              {sizeValue}
            </div>
          ))}
        </div>
      </div>

      <PriceFilter />
    </nav>
  );
};

export default Sidebar;
