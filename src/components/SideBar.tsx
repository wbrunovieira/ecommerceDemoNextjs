"use client";

import Image from "next/image";
import Link from "next/link";

import PriceFilter from "./PriceFilter";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { useColorStore, useSelectionStore } from "@/context/store";

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
}

interface Brand {
  id: string;
  name: string;
  imageUrl: string;
}
interface Color {
  id: string;
  name: string;
  hex: string;
}
interface Size {
  id: string;
  name: string;
}
interface Material {
  id: string;
  name: string;
}

interface SidebarProps {
  initialCategories: Category[];
}

const Sidebar: React.FC<SidebarProps> = ({ initialCategories }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);

  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [categories, setCategories] = useState<Category[]>(
    initialCategories || []
  );

  const searchParams = useSearchParams();

  const router = useRouter();
  const pathname = usePathname();

  const selectedCategory = useSelectionStore((state) => state.selectedCategory);
  const selectedBrand = useSelectionStore((state) => state.selectedBrand);
  const selectedMaterial = useSelectionStore((state) => state.selectedMaterial);
  const selectedColor = useColorStore((state) => state.selectedColor);
  const selectedSize = useSelectionStore((state) => state.selectedSize);
  const selectedMinPrice = useSelectionStore((state) => state.selectedMinPrice);
  const selectedMaxPrice = useSelectionStore((state) => state.selectedMaxPrice);

  const setSelectedCategory = useSelectionStore(
    (state) => state.setSelectedCategory
  );
  const setSelectedBrand = useSelectionStore((state) => state.setSelectedBrand);
  const setSelectedMaterial = useSelectionStore(
    (state) => state.setSelectedMaterial
  );
  const setSelectedColor = useColorStore((state) => state.setSelectedColor);
  const setSelectedSize = useSelectionStore((state) => state.setSelectedSize);
  const setSelectedMinPrice = useSelectionStore(
    (state) => state.setSelectedMinPrice
  );
  const setSelectedMaxPrice = useSelectionStore(
    (state) => state.setSelectedMaxPrice
  );

  let isHome = pathname === "/";

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const handleCategoryClick = (categoryId: string) => {
    isHome = pathname === "/";
    if (isHome) {
      router.push(`/filtered?category=${categoryId}`);
    } else {
      setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    }
  };

  const handleMaterialClick = (materialId: string) => {
    isHome = pathname === "/";
    if (isHome) {
      router.push(`/filtered?material=${materialId}`);
    } else {
      setSelectedMaterial(materialId === selectedCategory ? null : materialId);
    }
  };

  const handleBrandClick = (brandId: string) => {
    const isHome = pathname === "/";
    if (isHome) {
      router.push(`/filtered?brand=${brandId}`);
    } else {
      setSelectedBrand(brandId === selectedBrand ? null : brandId);
    }
  };

  const handleColorClick = (colorId: string) => {
    const isHome = pathname === "/";
    if (isHome) {
      router.push(`/filtered?color=${colorId}`);
    } else {
      setSelectedColor(colorId === selectedColor ? null : colorId);
    }
  };
  const handleSizeClick = (sizeId: string) => {
    const isHome = pathname === "/";
    if (isHome) {
      router.push(`/filtered?size=${sizeId}`);
    } else {
      setSelectedSize(sizeId === selectedSize ? null : sizeId);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "http://localhost:3333/category/all?page=1&pageSize=10"
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("data categories", data.categories);

        const fetchedCategories = data.categories.map((category: any) => ({
          id: category._id.value,
          name: category.props.name,
          slug: category.props.slug || "localhost",
          imageUrl: category.props.imageUrl || "/default-image.png",
        }));

        console.log("fetchedCategories", fetchedCategories);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    const fetchSizes = async () => {
      try {
        const res = await fetch(
          "http://localhost:3333/size/all?page=1&pageSize=10"
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("data sizes", data);
        const sizeOrder = ["pp", "p", "m", "g", "xg"];

        const fetchedSize = data.size.map((size: any) => ({
          id: size._id.value,
          name: size.props.name,
        }));
        fetchedSize.sort((a: Size, b: Size) => {
          return sizeOrder.indexOf(a.name) - sizeOrder.indexOf(b.name);
        });

        console.log("fetchedSize", fetchedSize);

        setSizes(fetchedSize);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setSizes([]);
      }
    };

    const fetchColors = async () => {
      try {
        const res = await fetch(
          "http://localhost:3333/colors/all?page=1&pageSize=10"
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("data colors", data);

        const fetchedColors = data.colors.map((color: any) => ({
          id: color._id.value,
          name: color.props.name,
          hex: color.props.hex || "#00000",
        }));
        console.log("fetchedColors", fetchedColors);
        setColors(fetchedColors);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setColors([]);
        [];
      }
    };

    const fetchBrands = async () => {
      try {
        const res = await fetch(
          "http://localhost:3333/brands/all?page=1&pageSize=10"
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        const fetchedBrands = data.brands.map((brand: any) => ({
          id: brand._id.value,
          name: brand.props.name,
          imageUrl: brand.props.imageUrl || "/default-brand-image.png",
        }));
        setBrands(fetchedBrands);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setBrands([]);
      }
    };
    const fetchMaterials = async () => {
      try {
        const res = await fetch(
          "http://localhost:3333/materials/all?page=1&pageSize=10"
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        const fetchedMaterials = data.materials.map((material: any) => ({
          id: material._id.value,
          name: material.props.name,
        }));
        setMaterials(fetchedMaterials);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setBrands([]);
      }
    };

    fetchCategories();
    fetchBrands();
    fetchColors();
    fetchSizes();
    fetchMaterials();
  }, []);

  useEffect(() => {
    if (pathname === "/") {
      setSelectedCategory(null);
      setSelectedBrand(null);
      setSelectedSize(null);
      setSelectedMinPrice(null);
      setSelectedMaxPrice(null);
      setSelectedMaterial(null);
      setSelectedColor(null);
    }
  }, [
    pathname,
    setSelectedCategory,
    setSelectedBrand,
    setSelectedSize,
    setSelectedMinPrice,
    setSelectedMaxPrice,
    setSelectedMaterial,
  ]);

  return (
    <nav className="flex flex-col gap-2 mr-4  rounded">
      <div className="flex flex-col w-48 border border-light bg-primaryLight rounded p-4 mt-2 z-10">
        <h2 className="text-primaryDark text-base tracking-wider mb-2">
          Categorias
        </h2>
        <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4" />

        {categories.map((category) => (
          <div
            key={category.id}
            className={`flex items-center py-1 border-b border-light cursor-pointer rounded p-2 hover:bg-primary transition duration-300 ease-in-out  ${
              selectedCategory === category.id
                ? "bg-primaryDark text-primaryLight font-bold tracking-wider antialiased border rounded p-4 "
                : ""
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="flex items-center py-2 space-x-2">
              <Image
                src={category.imageUrl}
                width={20}
                height={20}
                alt={category.name}
                className="mr-2"
              />
              <div className="text-xs">
                {capitalizeFirstLetter(category.name)}
              </div>
            </div>
          </div>
        ))}

        <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4" />
      </div>

      <div className="flex flex-col w-48 border border-light p-4 mt-2 bg-primaryLight rounded">
        <h2 className="text-primaryDark text-base tracking-wider rounded mb-2 ">
          Marcas
        </h2>
        <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4 " />
        {brands.map((brand) => (
          <div
            key={brand.id}
            className={`flex items-center py-1 border-b border-light cursor-pointer rounded p-2 hover:bg-primary transition duration-300 ease-in-out ${
              selectedBrand === brand.id
                ? "bg-primaryDark text-primaryLight border font-bold tracking-wider rounded p-4"
                : ""
            }`}
            onClick={() => handleBrandClick(brand.id)}
          >
            <div className="flex items-center py-2 space-x-2">
              <Image
                src={brand.imageUrl}
                width={20}
                height={20}
                alt={brand.name}
                className="mr-2"
              />
              <div className="text-xs">{capitalizeFirstLetter(brand.name)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col w-48 border border-light p-4 mt-2 bg-primaryLight rounded">
        <h2 className="text-primaryDark text-base tracking-wider rounded mb-2 ">
          Cores
        </h2>
        <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4" />
        <div className="flex gap-2 flex-wrap">
          {colors.map((color) => (
            <div
              key={color.id}
              className={`w-6 h-6 rounded-full cursor-pointer p-2 transform hover:scale-110 hover:shadow-lg transition duration-300 ease-in-out ${
                selectedColor === color.id ? " border rounded p-4 w-8 h-8 " : ""
              }`}
              style={{
                backgroundColor: color.hex,
                border: "1px solid #ddd",
              }}
              onClick={() => handleColorClick(color.id)}
              title={color.name}
            ></div>
          ))}
        </div>
      </div>

      <div className="flex flex-col w-48 border border-light p-4 mt-2 bg-primaryLight rounded">
        <h2 className="text-primaryDark text-base tracking-wider rounded mb-2 ">
          Tamanhos
        </h2>
        <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4" />
        <div className="flex gap-1 justify-start p-1 w-16">
          {sizes.map((size, index) => (
            <div
              key={size.id}
              className={`border border-light rounded p-1 text-xs cursor-pointer rounded p-2 hover:bg-primary transition duration-300 ease-in-out ${
                selectedSize === size.id
                  ? "bg-primaryDark text-primaryLight font-bold tracking-wider border"
                  : ""
              }`}
              onClick={() => handleSizeClick(size.id)}
            >
              {capitalizeFirstLetter(size.name)}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col w-48 border border-light p-4 mt-2 bg-primaryLight rounded">
        <h2 className="text-primaryDark text-base tracking-wider rounded mb-2 ">
          Materiais
        </h2>
        <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4" />
        <div className="flex flex-col gap-1 justify-start p-1 w-32">
          {materials.map((material, index) => (
            <div
              key={index}
              className={`border border-light rounded text-xs cursor-pointer rounded p-2 hover:bg-primary transition duration-300 ease-in-out ${
                selectedMaterial === material.id
                  ? "bg-primaryDark text-primaryLight font-bold tracking-wider border"
                  : ""
              }`}
              onClick={() => handleMaterialClick(material.id)}
            >
              {capitalizeFirstLetter(material.name)}
            </div>
          ))}
        </div>
      </div>

      <PriceFilter isHome={isHome} />
    </nav>
  );
};

export default Sidebar;
