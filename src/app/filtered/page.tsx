"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Card from "@/components/Card";
import Link from "next/link";
import Container from "@/components/Container";
import Sidebar from "@/components/SideBar";
import { NextPage } from "next";
import { useSelectionStore } from "@/context/store";

interface ProductCategory {
  category: {
    id: {
      value: string;
    };
    name: string;
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  slug: string;
  FinalPrice: number;
  productCategories: ProductCategory[];
  onSale: boolean;
  isNew: boolean;
  discount: number;
  images: string[];
  finalPrice: number;
  brandId: string;
  brandName: string;
  brandUrl: string;
}

const FilteredResults: NextPage = () => {
  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  const brand = searchParams.get("brand");

  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);

  const selectedCategory = useSelectionStore((state) => state.selectedCategory);
  const selectedBrand = useSelectionStore((state) => state.selectedBrand);
  const setSelectedCategory = useSelectionStore(
    (state) => state.setSelectedCategory
  );
  const setSelectedBrand = useSelectionStore((state) => state.setSelectedBrand);

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
        brandId: product.props.brandId.value,
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
    }
  }, [category, brand]);

  useEffect(() => {
    if (!initialLoad) {
      const filterProducts = () => {
        let filteredProducts = allProducts;

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
        console.log("Filtered Products:", filteredProducts);
        setProducts(filteredProducts);
      };

      filterProducts();
    }
  }, [selectedCategory, selectedBrand, allProducts, initialLoad]);

  console.log("selectedCategory", selectedCategory);
  console.log("selectedBrand", selectedBrand);
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
            Produtos filtrados por "{category || brand}"
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
