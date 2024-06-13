"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Card from "@/components/Card";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  slug: string;
  FinalPrice: number;
  onSale: boolean;
  isNew: boolean;
  discount: number;
  images: string[];
  finalPrice: number;
}

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (query) {
      const fetchProducts = async () => {
        try {
          const response = await fetch(
            `http://localhost:3333/products/search?name=${encodeURIComponent(
              query
            )}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("response data", data);

          const mappedProducts = data.products.map((product: any) => ({
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
          }));
          setProducts(mappedProducts);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };

      fetchProducts();
    }
  }, [query]);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Resultados da pesquisa para "{query}"
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.slug}`} passHref>
            <Card
              id={product.id}
              title={product.name}
              category={product.description}
              precoAntigo={product.onSale ? product.price : undefined}
              precoNovo={product.FinalPrice || product.price}
              emPromocao={product.onSale}
              desconto={product.discount}
              imageSRC={product.images[0]}
              eNovidade={product.isNew}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
