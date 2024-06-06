import Container from "@/components/Container";
import Sidebar from "@/components/SideBar";
import Product from "@/components/Product";
import { getProducts, getProductBySlug } from "@/api/products";

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

const ProductPage = async ({ params }: ParamsProps) => {
  try {
    const {
      product,
      materialName,
      brandName,
      colors,
      sizeNames,
      categoryName,
    } = await getProductBySlug(params.slug);

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
    const productSlug = productDetails?.slug?? "No slug available";
    const productColors = colors ?? [];
    const productSizes = sizeNames ?? [];
    const productCategories =
      categoryName?.join(", ") ?? "No categories available";



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
            size={productSizes}
            images={productImages}
            description={productDescription ?? "No description available."}
            stock={productDetails.stock}
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
