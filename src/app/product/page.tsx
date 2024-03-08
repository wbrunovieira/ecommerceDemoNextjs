import type { NextPage } from 'next';

import Container from '@/components/Container';
import Sidebar from '@/components/SideBar';
import Product from '@/components/Product';

const Home: NextPage = () => {
  return (
    <>
      <Container>
        <section className='flex mt-2'>
          <div className='flex flex-col '>
            <Sidebar />
          </div>
          <Product
            title='Calcinha Biquini 50030'
            material='Algodão'
            categoria='Lingerie'
            fabricante='Liz'
            id='12021545454'
            price={20.0}
            color={['#000', '#ff0000']}
            size={['P', 'M', 'G', 'GG']}
            images={[
              '/images/liz1.webp',
              '/images/liz2.webp',
              '/images/liz3.webp',
              '/images/liz4.webp',
              '/images/liz5.webp',
              '/images/liz6.webp',
            ]}
            description='Uma calcinha coringa, para o dia a dia, na modelagem mais vendida da Liz. Tenha uma de cada cor e colecione!'
          />
        </section>
      </Container>
    </>
  );
};
export default Home;
