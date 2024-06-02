import axios from "axios";

export type Product = {
  name: string;
  description: string;
  productSizes?: string[];
  productColors?: string[];
  productCategories?: string[];
  materialId?: string;
  sizeId?: string[];
  finalPrice?: number;
  brandId: string;
  discount?: number;
  price: number;
  stock: number;
  sku: string;
  slug: string;
  height: number;
  width: number;
  length: number;
  weight: number;
  onSale?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
};

interface ProductsResponse {
  products: Product[];
}
interface ProductResponse {
  product: Product;
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch("http://localhost:3333/products/all");
  const data: ProductsResponse = await response.json();
  console.log("todos os produtos", data);
  if (!Array.isArray(data.products)) {
    throw new Error("Expected an array of products");
  }
  return data.products;
}

export async function getProduct(id: string) {
  const response = await fetch(`http://localhost:3333/products/${id}`);
  return (await response.json()) as Product;
}

export async function getProductBySlug(slug: string) {
  const response = await axios.get(
    `http://localhost:3333/products/slug/${slug}`
  );
  return response.data.product;
}
