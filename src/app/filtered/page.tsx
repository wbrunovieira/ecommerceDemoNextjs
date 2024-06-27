"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Card from "@/components/Card";
import Link from "next/link";
import Container from "@/components/Container";
import Sidebar from "@/components/SideBar";
import { NextPage } from "next";
import { useColorStore, useSelectionStore } from "@/context/store";

interface ProductCategory {
  category: {
    id: {
      value: string;
    };
    name: string;
  };
}
interface ProductColor {
  color: {
    id: {
      value: string;
    };
    name: string;
  };
}
interface ProductSize {
  id: {
    value: string;
  };
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  slug: string;
  FinalPrice: number;
  productCategories: ProductCategory[];
  productColors: ProductColor[];
  productSizes: ProductSize[];
  onSale: boolean;
  isNew: boolean;
  discount: number;
  images: string[];
  finalPrice: number;
  materialId: string;
  brandId: string;
  brandName: string;
  brandUrl: string;
}

const FilteredResults: NextPage = () => {
  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const material = searchParams.get("material");
  const color = searchParams.get("color");
  const size = searchParams.get("size");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);

  const selectedCategory = useSelectionStore((state) => state.selectedCategory);
  const selectedColor = useColorStore((state) => state.selectedColor);
  const selectedBrand = useSelectionStore((state) => state.selectedBrand);
  const selectedSize = useSelectionStore((state) => state.selectedSize);
  const selectedMinPrice = useSelectionStore((state) => state.selectedMinPrice);
  const selectedMaxPrice = useSelectionStore((state) => state.selectedMaxPrice);
  const selectedMaterial = useSelectionStore((state) => state.selectedMaterial);

  const setSelectedCategory = useSelectionStore(
    (state) => state.setSelectedCategory
  );
  const setSelectedBrand = useSelectionStore((state) => state.setSelectedBrand);
  const setSelectedMaterial = useSelectionStore(
    (state) => state.setSelectedMaterial
  );
  const setSelectedSize = useSelectionStore((state) => state.setSelectedSize);
  const setSelectedColor = useColorStore((state) => state.setSelectedColor);
  const setSelectedMinPrice = useSelectionStore(
    (state) => state.setSelectedMinPrice
  );
  const setSelectedMaxPrice = useSelectionStore(
    (state) => state.setSelectedMaxPrice
  );

  const fetchProducts = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("data from filtered", data);

      const mappedProducts = data.map((product: any) => ({
        id: product._id?.value,
        name: product.props.name,
        description: product.props.description,
        price: product.props.price,
        slug: product.props.slug.value,
        finalPrice: product.props.finalPrice,
        onSale: product.props.onSale,
        isNew: product.props.isNew,
        discount: product.props.discount,
        images: product.props.images,
        productCategories: product.props.productCategories.map(
          (category: any) => ({
            category: { id: category.id, name: category.name },
          })
        ),
        productColors: product.props.productColors.map((color: any) => ({
          color: { id: color.id, name: color.name },
        })),
        productSizes: product.props.productSizes.map((size: any) => ({
          id: size.id,
          name: size.name,
        })),
        brandId: product.props.brandId.value,
        materialId: product.props.materialId.value,
        brandName: product.props.brandName,
        brandUrl: product.props.brandUrl,
      }));

      console.log("mappedProducts from filtered", mappedProducts);
      setAllProducts(mappedProducts);
      setProducts(mappedProducts);
      setInitialLoad(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    if (category) {
      fetchProducts(
        `http://localhost:3333/products/category/${encodeURIComponent(
          category
        )}`
      );

      setSelectedCategory(category);
    } else if (brand) {
      fetchProducts(
        `http://localhost:3333/products/brand/${encodeURIComponent(brand)}`
      );
      setSelectedBrand(brand);
    } else if (size) {
      fetchProducts(
        `http://localhost:3333/products/size/${encodeURIComponent(size)}`
      );
      setSelectedSize(size);
    } else if (minPrice && maxPrice) {
      fetchProducts(
        `http://localhost:3333/products/price-range?minPrice=${encodeURIComponent(
          minPrice
        )}&maxPrice=${encodeURIComponent(maxPrice)}`
      );
      setSelectedMinPrice(Number(minPrice));
      setSelectedMaxPrice(Number(maxPrice));
    } else if (material) {
      fetchProducts(
        `http://localhost:3333/products/material/${encodeURIComponent(
          material
        )}`
      );
      setSelectedMaterial(material);
    }
  }, [category, brand, size, minPrice, maxPrice, material]);

  useEffect(() => {
    if (color) {
      fetchProducts(
        `http://localhost:3333/products/color/${encodeURIComponent(color)}`
      );
      setSelectedColor(color);
    }
  }, [color]);

  useEffect(() => {
    if (!initialLoad) {
      const filterProducts = () => {
        let filteredProducts = allProducts;
        console.log("filteredProducts", filteredProducts);

        if (selectedCategory) {
          filteredProducts = filteredProducts.filter((product) =>
            product.productCategories.some((cat) => {
              console.log("category.id", cat.category.id.value);
              return cat.category.id.value === selectedCategory;
            })
          );
        }

        if (selectedBrand) {
          filteredProducts = filteredProducts.filter(
            (product) => product.brandId === selectedBrand
          );
        }
        if (selectedMaterial) {
          filteredProducts = filteredProducts.filter(
            (product) => product.materialId === selectedMaterial
          );
        }

        if (selectedColor) {
          filteredProducts = filteredProducts.filter((product) =>
            product.productColors.some((cat) => {
              console.log("color.id", cat.color.id.value);
              return cat.color.id.value === selectedColor;
            })
          );
        }

        if (selectedSize) {
          filteredProducts = filteredProducts.filter((product) =>
            product.productSizes.some((siz) => siz.id.value === selectedSize)
          );
        }

        if (selectedMinPrice !== null && selectedMaxPrice !== null) {
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.finalPrice >= selectedMinPrice &&
              product.finalPrice <= selectedMaxPrice
          );
        }
        console.log("Filtered Products:", filteredProducts);
        setProducts(filteredProducts);
      };

      filterProducts();
    }
  }, [
    selectedCategory,
    selectedBrand,
    selectedColor,
    selectedSize,
    selectedMaterial,
    allProducts,
    initialLoad,
    selectedMinPrice,
    selectedMaxPrice,
  ]);

  console.log("selectedCategory", selectedCategory);
  console.log("selectedBrand", selectedBrand);
  console.log("selectedColor", selectedColor);
  console.log("selectedMaterial", selectedMaterial);
  console.log("selectedSize", selectedSize);
  console.log("allProducts", allProducts);
  console.log("initialLoad", initialLoad);
  console.log("products", products);
  return (
    <Container>
      <section className="flex mt-2 gap-8">
        <div className="flex flex-col">
          <Sidebar initialCategories={[]} />
        </div>
        <div className="flex flex-col"></div>
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-4">
            Produtos filtrados por "{category || brand || material}"
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`} passHref>
                <Card
                  id={product.id}
                  title={product.name}
                  categories={product.productCategories}
                  precoAntigo={product.onSale ? product.price : undefined}
                  precoNovo={product.finalPrice || product.price}
                  emPromocao={product.onSale}
                  desconto={product.discount}
                  imageSRC={product.images[0]}
                  eNovidade={product.isNew}
                  brandName={product.brandName}
                  brandLogo={product.brandUrl}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Container>
  );
};

export default FilteredResults;
