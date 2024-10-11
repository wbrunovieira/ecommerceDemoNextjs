import Container from '@/components/Container';
import Sidebar from '@/components/SideBar';
import Product from '@/components/Product';
import {
    getProducts,
    getProductBySlug,
    ProductProps,
    productCategories,
    getCategoriesId,
    getProductsByCategoriesId,
    ProductsByCategorieResponse,
} from '@/api/products';
import SuspenseWrapper from '@/components/SuspenseWrapper';

export async function generateStaticParams() {
    try {
        const products = await getProducts();
        console.log('async function generateStaticParams products', products);

        return products.map((product) => ({
            slug: product.slug,
        }));
    } catch (error) {
        console.error('Error fetching data', error);
        return [];
    }
}

interface ParamsProps {
    params: {
        slug: string;
    };
}
interface ProductDetails {
    name?: string;
    description?: string;
    finalPrice?: number;
    images?: string[];
    height?: number;
    width?: number;
    length?: number;
    weight?: number;
    slug?: string;
    stock?: number;
    hasVariants: boolean;
    productIdVariant: string;

    productCategories: string;
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
interface Category {
    id: string;
    name: string;
}
interface ProductVariant {
    id: string;
    sizeId?: string;
    colorId?: string;
    stock: number;
    price: number;
    images: string[];
    sku: string;
}

const productCategoryIds = await getCategoriesId();

const getSimilarProducts = async (
    currentProductCategories: Category[],
    products: ProductProps[]
): Promise<
    { id: string; title: string; image: string; price: number; slug: string }[]
> => {
    const currentProductCategoryIds = currentProductCategories.map(
        (cat: Category) => cat.id
    );

    if (currentProductCategoryIds.length === 0) {
        console.error('No category IDs found');
        return [];
    }

    try {
        const categoryProductsResponse: ProductsByCategorieResponse =
            await getProductsByCategoriesId(currentProductCategoryIds[0]);

        if (!categoryProductsResponse || !categoryProductsResponse.products) {
            console.error('No products found for the category');
            return [];
        }

        const allCategoryProducts = categoryProductsResponse.products.map(
            (product) => ({
                id: product._id.value,
                name: product.props.name,
                price: product.props.price,
                images: product.props.images,
                slug: product.props.slug.value,
            })
        );

        return allCategoryProducts.slice(0, 4).map((product) => ({
            id: product.id,
            title: product.name,
            image: product.images?.[0] || '',
            price: product.price,
            slug: product.slug || '',
        }));
    } catch (error) {
        console.error(`Error fetching products for category: ${error}`);
        return [];
    }
};

const ProductPage = async ({ params }: ParamsProps) => {
    try {
        const productDetails = await getProductBySlug(params.slug);

        if (!productDetails) {
            return <div>Desculpe, não encontramos a página do produto.</div>;
        }

        const productId = productDetails.id;

        if (!productId) {
            console.error('Product ID not found');
            return <div>Product ID not found</div>;
        }

        const allProducts = await getProducts();
        console.log('product page allProducts ', allProducts);
        const similarProducts = await getSimilarProducts(
            productDetails.productCategories,
            allProducts as ProductProps[]
        );

        return (
            <SuspenseWrapper>
                <Container>
                    <section className="flex w-full max-w-full mt-2 gap-4 lg:gap-8 z-10 lg:flex-row">
                        <div className="flex flex-col ">
                            <Sidebar />
                        </div>

                        <div className="z-10 w-full max-w-full">
                            <Product
                                id={productDetails.id}
                                title={productDetails.name}
                                description={productDetails.description}
                                material="N/A" // Replace this with the correct value if available
                                fabricante={productDetails.brandName} // Now using brandName from productDetails
                                price={productDetails.finalPrice}
                                colors={[]} // Colors are empty in the given API response example
                                sizes={productDetails.productSizes}
                                categories={productDetails.productCategories}
                                images={productDetails.images}
                                stock={productDetails.stock}
                                hasVariants={productDetails.hasVariants}
                                productIdVariant={productDetails.id}
                                variants={productDetails.productVariants}
                                similarProducts={similarProducts}
                                width={productDetails.width}
                                height={productDetails.height}
                                length={productDetails.length}
                                weight={productDetails.weight}
                                slug={productDetails.slug}
                            />
                            {/* <Product
                                id={productId}
                                title={productName}
                                
                                categories={productCategories}
                                fabricante={productBrand ?? 'N/A'}
                                price={productFinalPrice ?? 0}
                                colors={productColors}
                                sizes={productSizes}
                                images={productImages}
                                description={
                                    productDescription ??
                                    'No description available.'
                                }
                                stock={productDetails.stock}
                                variants={productDetails.productVariants}
                                similarProducts={similarProducts}
                                width={width}
                                height={height}
                                length={length}
                                weight={weight}
                                slug={slug}
                                hasVariants={hasVariants}
                                productIdVariant={productIdVariant}
                            /> */}
                        </div>
                    </section>
                </Container>
            </SuspenseWrapper>
        );
    } catch (error) {
        console.error('Error fetching product:', error);
        return <div>Error fetching product</div>;
    }
};

export default ProductPage;
