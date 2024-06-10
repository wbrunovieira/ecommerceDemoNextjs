export type productCategories = {
  productId: string;
  categoryId: string;
};

export type ProductProps = {
  id: string;
  name: string;
  description: string;
  productSizes?: { value: string }[];
  productColors?: { value: string }[];
  productCategories?: productCategories[];
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
  similarProducts?: ProductProps[];
};

export type ProductType = {
  _id: { value: string };
  props: ProductProps;
};

export interface ProductsResponse {
  products: ProductProps[];
}

interface ProductSlugResponse {
  product: ProductType;
  materialName: string;
  brandName: string;
  colors: { id: string; name: string; hex: string }[];
  sizes: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  variants: {
    id: string;
    sizeId?: string;
    colorId?: string;
    stock: number;
    price: number;
    images: string[];
    sku: string;
  }[];
}

export async function getProducts(): Promise<ProductProps[]> {
  const response = await fetch("http://localhost:3333/products/all");
  const data: ProductsResponse = await response.json();

  if (!Array.isArray(data.products)) {
    throw new Error("Expected an array of products");
  }
  return data.products;
}

export async function getProduct(id: string) {
  const response = await fetch(`http://localhost:3333/products/${id}`);
  return (await response.json()) as ProductType;
}

export async function getProductBySlug(
  slug: string
): Promise<ProductSlugResponse> {
  const response = await fetch(`http://localhost:3333/products/slug/${slug}`);
  const data: ProductSlugResponse = await response.json();

  return data;
}
