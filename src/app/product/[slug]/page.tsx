import Container from "@/components/Container";
import Sidebar from "@/components/SideBar";
import Product from "@/components/Product";
import {
  getProducts,
  getProductBySlug,
  ProductProps,
  productCategories,
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

interface ProductInter {
  _id: {
    value: string;
  };
  props: ProductDetails;
  categories: Category[];
  colors?: Color[];
  sizes?: Size[];
  variants: ProductVariant[];
}

const getSimilarProducts = (
  currentProductCategories: Category[],
  products: ProductProps[]
) => {
  console.log("currentProductCategories", currentProductCategories);

 
  const currentProductCategoryIds = currentProductCategories.map(
    (cat: Category) => cat.id
  );

  console.log("currentProductCategoryIds", currentProductCategoryIds);

  const sameCategoryProducts = products.filter((product) => {

    if (!product.productCategories) return false;

    const productCategoryIds = product.productCategories.map(
      (cat) => cat.categoryId
    );
    console.log("productCategoryIds", productCategoryIds);
    console.log("productCategoryIds for product", product.id, productCategoryIds);


    return currentProductCategoryIds.some((id) =>
      productCategoryIds.includes(id)
    );
  });
  console.log("same category", sameCategoryProducts);

  return sameCategoryProducts.slice(0, 4).map((product) => ({
    id: product.id,
    title: product.name,
    image: product.images?.[0] || "",
    price: product.price,
  }));
};

const ProductPage = async ({ params }: ParamsProps) => {
  try {
    const {
      product,
      materialName,
      brandName,
      colors,
      sizes,
      categories,
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
    const productCategories = categories ?? [];

    console.log("productCategories", productCategories);
    const allProducts = await getProducts();
    const similarProducts = getSimilarProducts(
      productCategories,
      allProducts as ProductProps[]
    );

    console.log("similarProducts antes do return", similarProducts);

    console.log("product antes do return", product);

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
            categories={productCategories}
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
