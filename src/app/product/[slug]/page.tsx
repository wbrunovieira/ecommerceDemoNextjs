import Container from "@/components/Container";
import Sidebar from "@/components/SideBar";
import Product from "@/components/Product";
import {
  getProducts,
  getProductBySlug,
  ProductType,
  ProductResponse,
} from "@/api/products";

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    slug: product.slug,
  }));
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
  slug?: string;
  stock?: number;
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
interface ProductVariant {
  id: string;
  sizeId?: string;
  colorId?: string;
  stock: number;
  price: number;
  images: string[];
  sku: string;
}
interface ProductProps extends ProductInter {
  similarProducts: ProductInter[];
}

interface ProductInter {
  _id: {
    value: string;
  };
  props: ProductDetails;
  categoria: string;
  colors?: Color[];
  sizes?: Size[];
  variants: ProductVariant[];
}

interface ProductSimilar extends ProductInter {}

interface ProductProps extends ProductInter {
  similarProducts: ProductSimilar[];
}

const getSimilarProducts = (
  currentProduct: ProductInter,
  products: ProductInter[]
): ProductInter[] => {
  const { categoria, colors, sizes } = currentProduct;

  const sameCategoryProducts = products.filter(
    (product) =>
      product.categoria === categoria &&
      product._id.value !== currentProduct._id.value
  );

  const prioritizedProducts = sameCategoryProducts.sort((a, b) => {
    const aScore =
      (colors &&
      a.colors?.some((color) => colors.some((c) => c.id === color.id))
        ? 1
        : 0) +
      (sizes && a.sizes?.some((size) => sizes.some((s) => s.id === size.id))
        ? 1
        : 0);
    const bScore =
      (colors &&
      b.colors?.some((color) => colors.some((c) => c.id === color.id))
        ? 1
        : 0) +
      (sizes && b.sizes?.some((size) => sizes.some((s) => s.id === size.id))
        ? 1
        : 0);
    return bScore - aScore;
  });

  return prioritizedProducts.slice(0, 4);
};

const ProductPage = async ({ params }: ParamsProps) => {
  try {
    const {
      product,
      materialName,
      brandName,
      colors,
      sizes,
      categoryName,
      variants,
    } = (await getProductBySlug(params.slug)) as any;

    if (!product) {
      console.error("Product not found");
      return <div>Product not found</div>;
    }

    const productId = product._id?.value;

    if (!productId) {
      console.error("Product ID not found");
      return <div>Product ID not found</div>;
    }

    const productDetails = product.props;

    const productName = productDetails?.name ?? "No name available";
    const productDescription =
      productDetails?.description ?? "No description available";
    const productMaterial = materialName ?? "N/A";
    const productBrand = brandName ?? "N/A";
    const productFinalPrice = productDetails?.finalPrice ?? 0;
    const productImages = productDetails?.images ?? [];
    const productSlug = productDetails?.slug ?? "No slug available";
    const productColors = colors ?? [];
    const productSizes = sizes ?? [];
    const productCategories =
      categoryName?.join(", ") ?? "No categories available";
    const allProducts = await getProducts();
    const similarProducts = getSimilarProducts(
      product,
      allProducts as ProductSimilar[]
    );

    return (
      <Container>
        <section className="flex mt-2 gap-8">
          <div className="flex flex-col">
            <Sidebar />
          </div>
          <Product
            id={productId}
            title={productName}
            material={productMaterial ?? "N/A"}
            categoria={productCategories}
            fabricante={productBrand ?? "N/A"}
            price={productFinalPrice ?? 0}
            colors={productColors}
            sizes={productSizes}
            images={productImages}
            description={productDescription ?? "No description available."}
            stock={productDetails.stock}
            variants={variants}
            similarProducts={similarProducts}
          />
        </section>
      </Container>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return <div>Error fetching product</div>;
  }
};

export default ProductPage;
