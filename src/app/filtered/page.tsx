"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Card from "@/components/Card";
import Link from "next/link";
import Container from "@/components/Container";
import Sidebar from "@/components/SideBar";
import { NextPage } from "next";

interface ProductCategory {
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
  onSale: boolean;
  isNew: boolean;
  discount: number;
  images: string[];
  finalPrice: number;
}


const FilteredResults: NextPage = () => {
  const searchParams = useSearchParams();
  console.log("searchParams", searchParams);
  const category = searchParams.get("category");
  console.log("category", category);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (category) {
      const fetchProducts = async () => {
        try {
          const response = await fetch(
            `http://localhost:3333/products/category/${encodeURIComponent(
              category
            )}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("response data", data);

          const mappedProducts = data.map((product: any) => ({
            id: product._id.value,
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
                id: category.id.value,
                name: category.name,
              })
            ),
          }));
          console.log("mappedProducts", mappedProducts);

          setProducts(mappedProducts);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };

      fetchProducts();
    }
  }, [category]);
 

  return (
    <Container>
      <section className="flex mt-2 gap-8">
        <div className="flex flex-col">
          <Sidebar initialCategories={[]} />
        </div>
        <div className="flex flex-col"></div>
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-4">
            Produtos filtrados por "{category}"
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`} passHref>
                <Card
                  id={product.id}
                  title={product.name}
                  categories={product.productCategories.map((category) => ({
                    category: { name: category.name },
                  }))}
                  precoAntigo={product.onSale ? product.price : undefined}
                  precoNovo={product.finalPrice || product.price}
                  emPromocao={product.onSale}
                  desconto={product.discount}
                  imageSRC={product.images[0]}
                  eNovidade={product.isNew}
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
