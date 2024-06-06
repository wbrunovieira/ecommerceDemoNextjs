
export type ProductProps = {
  name: string;
  description: string;
  productSizes?: { value: string }[];
  productColors?: { value: string }[];
  productCategories?: { value: string }[];
  materialId?: { value: string };
  sizeId?: { value: string }[];
  finalPrice?: number;
  brandId: { value: string };
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

export type Product = {
  _id: { value: string };
  props: ProductProps;
};

interface ProductsResponse {
  products: ProductProps[];
}

interface ProductSlugResponse {
  product: Product;
  materialName: string;
  brandName: string;

  colorNames: string[];
  sizeNames: string[];
  categoryName: string[];
}

export async function getProducts(): Promise<ProductProps[]> {
  const response = await fetch("http://localhost:3333/products/all");
  const data: ProductsResponse = await response.json();
  console.log("todos os produtos", data.products.length);
  if (!Array.isArray(data.products)) {
    throw new Error("Expected an array of products");
  }
  return data.products;
}

export async function getProduct(id: string) {
  const response = await fetch(`http://localhost:3333/products/${id}`);
  return (await response.json()) as Product;
}

export async function getProductBySlug(
  slug: string
): Promise<ProductSlugResponse> {
  const response = await fetch(`http://localhost:3333/products/slug/${slug}`);
  const data: ProductSlugResponse = await response.json();

  console.log("API Response:", data);
  return data;
}
