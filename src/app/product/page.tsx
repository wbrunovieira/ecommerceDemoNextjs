import type { NextPage } from 'next';

import Container from '@/components/Container';
import Sidebar from '@/components/SideBar';
import Product from '@/components/Product';

const Home: NextPage = () => {
  return (
    <>
      <Container>
        <section className='flex mt-2'>
          <Sidebar />
          <Product
            title='Calcinha Biquini 50030'
            material='Algodão'
            categoria='Lingerie'
            fabricante='Liz'
            id='12021545454'
            price={20.0}
            images={[
              '/images/foto1.jpg',
              '/images/foto2.jpg',
              '/images/foto3.jpg',
              '/images/foto4.jpg',
            ]}
            description='Uma calcinha coringa, para o dia a dia, na modelagem mais vendida da Liz. Tenha uma de cada cor e colecione!'
          />
        </section>
      </Container>
    </>
  );
};
export default Home;
