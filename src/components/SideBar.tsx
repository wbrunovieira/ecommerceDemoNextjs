"use client";

import Image from "next/image";
import Link from "next/link";

import PriceFilter from "./PriceFilter";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSelectionStore } from "@/context/store";

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

interface SidebarProps {
  initialCategories: Category[];
}

const Sidebar: React.FC<SidebarProps> = ({ initialCategories }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
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
  const selectedColor = useSelectionStore((state) => state.selectedColor);
  const selectedSize = useSelectionStore((state) => state.selectedSize);

  const setSelectedCategory = useSelectionStore(
    (state) => state.setSelectedCategory
  );
  const setSelectedBrand = useSelectionStore((state) => state.setSelectedBrand);
  const setSelectedColor = useSelectionStore((state) => state.setSelectedColor);
  const setSelectedSize = useSelectionStore((state) => state.setSelectedSize);

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const handleCategoryClick = (categoryId: string) => {
    const isHome = pathname === "/";
    if (isHome) {
      router.push(`/filtered?category=${categoryId}`);
    } else {
      setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
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

    fetchCategories();
    fetchBrands();
    fetchColors();
    fetchSizes();
  }, []);

  useEffect(() => {
    if (pathname === "/") {
      setSelectedCategory(null);
      setSelectedBrand(null);
      // setSelectedColor(null);
    }
  }, [pathname, setSelectedCategory, setSelectedBrand]);

  return (
    <nav className="flex flex-col gap-2 mr-4">
      <div className="flex flex-col w-48 border border-light rounded p-4 mt-2">
        <h2 className="text-primaryDark text-base tracking-wider mb-2">
          Categorias da api
        </h2>
        <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4" />

        {categories.map((category) => (
          <div
            key={category.id}
            className={`flex items-center py-1 border-b border-light cursor-pointer ${
              selectedCategory === category.id
                ? "bg-primary text-primaryLight border rounded p-4"
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

      <div className="flex flex-col w-48 border border-light p-4 mt-2 rounded">
        <h2 className="text-primaryDark text-base tracking-wider rounded mb-2 ">
          Marcas da api
        </h2>
        <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4" />
        {brands.map((brand) => (
          <div
            key={brand.id}
            className={`flex items-center py-1 border-b border-light cursor-pointer ${
              selectedBrand === brand.id
                ? "bg-primary text-primaryLight border rounded p-4"
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

      <div className="flex flex-col w-48 border border-light p-4 mt-2 rounded">
        <h2 className="text-primaryDark text-base tracking-wider rounded mb-2 ">
          Cores da api
        </h2>
        <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4" />
        <div className="flex gap-2 flex-wrap">
          {colors.map((color) => (
            <div
              key={color.id}
              className={`w-6 h-6 rounded-full cursor-pointer${
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

      <div className="flex flex-col w-48 border border-light p-4 mt-2 rounded">
        <h2 className="text-primaryDark text-base tracking-wider rounded mb-2 ">
          Tamanhos
        </h2>
        <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4" />
        <div className="flex gap-1 justify-start p-1 w-16">
          {sizes.map((size, index) => (
            <div
              key={size.id}
              className={`border border-light rounded p-1 text-xs cursor-pointer ${
                selectedSize === size.id ? " border rounded p-4 w-8 h-8 " : ""
              }`}
              onClick={() => handleSizeClick(size.id)}
              // className="border border-light rounded p-2 text-xs cursor-pointer"
            >
              {capitalizeFirstLetter(size.name)}
            </div>
          ))}
        </div>
      </div>

      <PriceFilter />
    </nav>
  );
};

export default Sidebar;
