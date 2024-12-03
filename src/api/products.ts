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
    productIdVariant: string;
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
    hasVariant: boolean;
    similarProducts?: ProductProps[];
};

interface ProductCategory {
    category: {
        id: string;
        name: string;
        imageUrl?: string;
    };
}

interface Produto {
    id: string;
    name: string;
    description: string;
    productCategories: ProductCategory[];
    price: number;
    hasVariants: boolean;
    slug: string;
    FinalPrice: number;
    onSale: boolean;
    isNew: boolean;
    discount: number;
    images: string[];
    finalPrice: number;
    height: number;
    width: number;
    length: number;
    weight: number;
    brand: {
        name: string;
        imageUrl: string;
    };
}

export type ProductType = {
    _id: { value: string };
    props: ProductProps;
};

interface ProductsResponseFeatured {
    products: Produto[];
}

export interface ProductsResponse {
    products: ProductProps[];
}

interface ProductSlugResponse {
    product: ProductType;
    materialName: string;
    brandName: string;
    hasVariants: boolean;
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

interface ProductDetails {
    id: string;
    name: string;
    description: string;
    finalPrice: number;
    stock: number;
    sku: string;
    height: number;
    width: number;
    length: number;
    weight: number;
    onSale: boolean;
    isFeatured: boolean;
    hasVariants: boolean;
    brandName: string;
    isNew: boolean;
    images: string[];
    slug: string;
    productSizes: { id: string; name: string }[];
    productColors: { id: string; name: string; hex: string }[];
    productCategories: { id: string; name: string; imageUrl: string }[];
    productVariants: {
        id: string;
        sizeId: string;
        stock: number;
        price: number;
        images: string[];
        sku: string;
    }[];
}

interface CategoriesResponse {
    categories: {
        _id: {
            value: string;
        };
        props: {
            name: string;
            createdAt: string;
            updatedAt: string;
        };
    }[];
}
export interface ProductsByCategorieResponse {
    products: {
        _id: {
            value: string;
        };
        props: {
            name: string;
            description: string;
            productSizes: any[];
            productColors: any[];
            productCategories: any[];
            materialId: { value: string } | null;
            sizeId: any[];
            finalPrice: number;
            brandId: { value: string } | null;
            discount: number;
            price: number;
            stock: number;
            sku: string;
            height: number;
            width: number;
            length: number;
            weight: number;
            onSale: boolean;
            isFeatured: boolean;
            isNew: boolean;
            images: string[];
            slug: { value: string };
            createdAt: string;
            updatedAt: string;
        };
    }[];
}
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;
console.log('BASE_URL no products.ts', BASE_URL);
if (!process.env.NEXT_PUBLIC_BASE_URL_BACKEND) {
    throw new Error('BASE_URL não definida no .env');
}

export async function getCategoriesId(): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/category/all?page=1&pageSize=10`);
    const data: CategoriesResponse = await response.json();

    console.log('Response JSON:', JSON.stringify(data, null, 2));

    if (!Array.isArray(data.categories)) {
        throw new Error('Expected an array of categories');
    }
    const ids = data.categories.map((category) => category._id.value);

    return ids;
}

export async function getProductsByCategoriesId(
    categoryId: string
): Promise<ProductsByCategorieResponse> {
    const response = await fetch(`${BASE_URL}/products/category/${categoryId}`);

    const data: any[] = await response.json();

    if (!Array.isArray(data)) {
        throw new Error('Expected an array of prodcuts');
    }

    const products = data.map((product) => ({
        _id: {
            value: product._id?.value ?? 'undefined',
        },
        props: {
            name: product.props?.name ?? 'undefined',
            description: product.props?.description ?? 'undefined',
            productSizes: product.props?.productSizes ?? [],
            productColors: product.props?.productColors ?? [],
            productCategories: product.props?.productCategories ?? [],
            materialId: product.props?.materialId
                ? { value: product.props.materialId.value }
                : null,
            sizeId: product.props?.sizeId ?? [],
            finalPrice: product.props?.finalPrice ?? 0,
            brandId: product.props?.brandId
                ? { value: product.props.brandId.value }
                : null,
            discount: product.props?.discount ?? 0,
            price: product.props?.price ?? 0,
            stock: product.props?.stock ?? 0,
            sku: product.props?.sku ?? '',
            height: product.props?.height ?? 0,
            width: product.props?.width ?? 0,
            length: product.props?.length ?? 0,
            weight: product.props?.weight ?? 0,
            onSale: product.props?.onSale ?? false,
            isFeatured: product.props?.isFeatured ?? false,
            isNew: product.props?.isNew ?? false,
            images: product.props?.images ?? [],
            slug: { value: product.props?.slug.value ?? 'undefined' },
            createdAt: product.props?.createdAt ?? 'undefined',
            updatedAt: product.props?.updatedAt ?? 'undefined',
        },
    }));

    return { products };
}

export async function getProducts(): Promise<ProductProps[]> {
    try {
        const response = await fetch(`${BASE_URL}/products/all`);

        console.log('getProducts BASE_URL', BASE_URL);
        console.log('getProducts response', response);

        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response text:', await response.text());
            throw new Error('Failed to fetch products');
        }

        const data: ProductsResponse = await response.json();
        console.log('getProducts data', data);
        console.log('getProducts data.products', data.products);

        if (!Array.isArray(data.products)) {
            throw new Error('Esperado um array de produtos');
        }

        return data.products;
    } catch (error) {
        console.error('Erro ao obter os produtos:', error);
        throw error;
    }
}

export async function getProduct(id: string) {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    return (await response.json()) as ProductType;
}

export async function getProductBySlug(
    slug: string
): Promise<ProductDetails | null> {
    try {
        const response = await fetch(`${BASE_URL}/products/slug/${slug}`);
        console.log('Response Status:', response.status);

        const responseBody = await response.text();

        console.log('Response Body:', responseBody);
        if (responseBody.includes('<html>')) {
            console.error('Received HTML instead of JSON');
            return null;
        }

        if (!response.ok) {
            console.error(
                'Erro na API:',
                response.status,
                await response.text()
            );
            throw new Error(
                `Failed to fetch product. Status: ${response.status}`
            );
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('Response is not JSON:', contentType);
            throw new Error('A resposta não é JSON');
        }

        const data = JSON.parse(responseBody);

        console.log('Raw Product Data:', JSON.stringify(data, null, 2));

        if (!data || !data.product) {
            throw new Error('Invalid product data received');
        }

        const product = data.product;
        console.log(
            'Raw Product Categories:',
            JSON.stringify(product.props?.productCategories, null, 2)
        );

        const productColors =
            product.props?.productColors?.map((color: any) => ({
                id: color.id?.value ?? '',
                name: color.name ?? 'Unknown',
                hex: color.hex ?? '#000000',
            })) ?? [];

        const productDetails: ProductDetails = {
            id: product._id?.value ?? '',
            name: product.props?.name ?? 'No name available',
            description:
                product.props?.description ?? 'No description available',
            finalPrice: product.props?.finalPrice ?? 0,
            stock: product.props?.stock ?? 0,
            sku: product.props?.sku ?? 'No SKU',
            height: product.props?.height ?? 0,
            width: product.props?.width ?? 0,
            length: product.props?.length ?? 0,
            weight: product.props?.weight ?? 0,
            onSale: product.props?.onSale ?? false,
            isFeatured: product.props?.isFeatured ?? false,
            hasVariants: product.props?.hasVariants ?? false,
            isNew: product.props?.isNew ?? false,
            images: product.props?.images ?? [],
            slug: data.slug?.value ?? '',
            brandName: data.brandName ?? 'N/A',

            productSizes:
                data.sizes?.map((size: any) => ({
                    id: size.id ?? '',
                    name: size.name ?? 'Unknown',
                })) ?? [],

            productCategories: (product.props?.productCategories ?? []).map(
                (category: any) => {
                    if (category && typeof category === 'object') {
                        return {
                            id: category.id?.value ?? '',
                            name: category.name ?? 'Unknown',
                            imageUrl: category.imageUrl ?? '',
                        };
                    } else {
                        console.warn('Unexpected category format:', category);
                        return {
                            id: '',
                            name: 'Unknown',
                            imageUrl: '',
                        };
                    }
                }
            ),

            productVariants:
                data.variants?.map((variant: any) => ({
                    id: variant.id ?? '',
                    sizeId: variant.sizeId ?? '',
                    stock: variant.stock ?? 0,
                    price: variant.price ?? 0,
                    images: variant.images ?? [],
                    sku: variant.sku ?? 'No SKU',
                })) ?? [],

            productColors: productColors,
        };
        console.log(
            'Transformed Product Categories:',
            JSON.stringify(productDetails.productCategories, null, 2)
        );

        return productDetails;
    } catch (error) {
        console.error('Error fetching product by slug:', error);
        return null;
    }
}

export async function getProductsFeatures(): Promise<Produto[]> {
    try {
        const response = await fetch(`${BASE_URL}/products/featured-products`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        console.log('response status: getProductsFeatures', response.status);
        console.log('response ok: getProductsFeatures', response.ok);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ProductsResponseFeatured = await response.json();
        console.log('data: getProductsFeatures', data);
        console.log('data: getProductsFeatures ', data.products);

        return data.products;
    } catch (error) {
        console.error('Erro ao buscar produtos: ', error);
        throw error;
    }
}
