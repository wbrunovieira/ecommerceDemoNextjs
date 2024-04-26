import { notFound } from 'next/navigation';

import Container from '@/components/Container';
import Sidebar from '@/components/SideBar';
import Product from '@/components/Product';

interface ProductPropsParams {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPropsParams) {
  const { id } = params;
  const res = await fetch(`http://localhost:3333/products/${id}`);
  console.log('res', res);
  const { product } = await res.json();
  console.log('product veio do fecht', product);
  if (!product) {
    return notFound();
  }

  const productImages =
    product.images.length > 0 ? product.images : ['/images/foto1.jpg'];
  return (
    <Container>
      <section className='flex mt-2 gap-8'>
        <div className='flex flex-col'>
          <Sidebar />
        </div>
        <Product
          title={product.name}
          material={product.material}
          categoria={product.brand}
          fabricante={product.brand}
          id={product.id}
          price={product.FinalPrice}
          color={[product.color]}
          size={[product.size]}
          images={productImages}
          description={product.description}
        />
      </section>
    </Container>
  );
}
