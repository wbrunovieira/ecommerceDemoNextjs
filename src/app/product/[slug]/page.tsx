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

interface ProductProps {
  params: {
    slug: string;
  };
}

const ProductPage = async ({ params }: ProductProps) => {
  const product = await getProductBySlug(params.slug);

  return (
    <Container>
      <section className="flex mt-2 gap-8">
        <div className="flex flex-col">
          <Sidebar />
        </div>
        <Product
          id={product.id}
          title={product.name}
          material={product.materialId ?? "N/A"}
          categoria={
            product.productCategories
              ? product.productCategories.join(", ")
              : "N/A"
          }
          fabricante={product.brandId ?? "N/A"}
          price={product.finalPrice ?? 0}
          color={product.productColors ?? []}
          size={product.productSizes ?? []}
          images={product.images ?? []}
          description={product.description ?? "No description available."}
        />
      </section>
    </Container>
  );
};

export default ProductPage;
