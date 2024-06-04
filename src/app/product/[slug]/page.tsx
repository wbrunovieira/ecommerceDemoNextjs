import Container from "@/components/Container";
import Sidebar from "@/components/SideBar";
import Product from "@/components/Product";
import { getProducts, getProductBySlug } from "@/api/products";

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    slug:
      typeof product.slug === "string"
        ? product.slug
        : (product.slug as { value: string }).value,
  }));
}

interface ProductProps {
  params: {
    slug: string;
  };
}

const ProductPage = async ({ params }: ProductProps) => {
  const response = await getProductBySlug(params.slug);

  const productId = response._id.value; // Assuming you need the product ID
  const productDetails = response.props;
  const productName = productDetails.name;
  const productDescription = productDetails.description;
  const productMaterialId = productDetails.materialId.value;
  const productBrandId = productDetails.brandId.value;
  const productFinalPrice = productDetails.finalPrice;
  const productImages = productDetails.images;
  const productSlug = productDetails.slug.value;

  console.log(" result", response.product);
  console.log(" result", response.materialName);
  console.log(" result", response.brandName);
  console.log("Product Name:", productName);
  console.log("Product Description:", productDescription);
  console.log("Product Material ID:", productMaterialId);
  console.log("Product Brand ID:", productBrandId);
  console.log("Product Final Price:", productFinalPrice);
  console.log("Product Images:", productImages);
  console.log("Product Slug:", productSlug);
  return (
    <Container>
      <section className="flex mt-2 gap-8">
        <div className="flex flex-col">
          <Sidebar />
        </div>
        <Product
          id={productId}
          title={productName}
          material={productName ?? "N/A"}
          categoria={productImages}
          fabricante={response.brandName ?? "N/A"}
          price={productFinalPrice ?? 0}
          color={[]}
          size={[]}
          images={productImages}
          description={productDescription ?? "No description available."}
          stock={response.props}
        />
      </section>
    </Container>
  );
};

export default ProductPage;
