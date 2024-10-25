interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    slug: string;
    finalPrice: number;
    productCategories: ProductCategory[];
    productColors: ProductColor[];
    productSizes: ProductSize[];
    onSale: boolean;
    isNew: boolean;
    discount: number;
    images: string[];
    brandId: string;
    brandName: string;
    brandUrl: string;
    height: number;
    width: number;
    length: number;
    weight: number;
    hasVariants: boolean;
}

interface ProductCategory {
    category: { id: { value: string }; name: string };
}
interface ProductColor {
    color: { id: { value: string }; name: string };
}
interface ProductSize {
    id: { value: string };
    name: string;
}

const fetchProducts = async (url: string): Promise<Product[]> => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        return data.map((product: any) => ({
            id: product._id?.value,
            name: product.props.name,
            description: product.props.description,
            price: product.props.price,
            slug: product.props.slug.value,
            hasVariants: product.props.hasVariants,
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
            brandName: product.props.brandName,
            brandUrl: product.props.brandUrl,
        }));
    } catch (error) {
        console.error('Error fetching search results:', error);
        return [];
    }
};

export default fetchProducts;
