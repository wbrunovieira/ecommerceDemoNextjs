import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import Container from '@/components/Container';
import Sidebar from '@/components/SideBar';
import ProductList from '@/components/ProductList';

import { ImagesSlider } from '@/components/ui/images-slider';

const Home: NextPage = () => {
  return (
    <>
      <Container>
        <div>
          <ImagesSlider
            className='h-[20rem]'
            images={[
              '/images/foto1banner2.png',
              '/images/foto2-2.jpg',
              '/images/foto3-2.jpg',
              '/images/foto4-3.jpg',
            ]}
            autoplay={true}
            direction='up'
          >
            <div className='z-10 -m-10  bg-primaryLight/[.7] p-4  rounded-lg'>
              <h1 className='text-primaryDark text-5xl '>
                Agora também <br /> estamos juntas na internet.
              </h1>
              <p className='text-secondary'>
                Faça o seu pedido que entregamos na sua casa.
              </p>
            </div>
          </ImagesSlider>
        </div>
        <div className='max-w-7xl mx-auto  mt-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            <div className='flex rounded-md border border-light hover:border-slate-400 p-2'>
              <div className='flex'>
                <Image
                  src='/icons/lingeries.svg'
                  alt='icone de lingerie'
                  width={50}
                  height={50}
                />
              </div>

              <Link
                href={'/'}
                className='text-xs font-regular uppercase pl-2 self-center'
              >
                Lingeries{' '}
                <span className='text-[11px] text-fontColor font-light'>
                  (53)
                </span>
                <p className='text-secondary text-[11px] capitalize font-normal'>
                  Mostrar Todas
                </p>
              </Link>
            </div>{' '}
            <div className='flex rounded-md border border-light hover:border-slate-400 p-2'>
              <div className='flex'>
                <Image
                  src='/icons/pijamas.svg'
                  alt='icone de lingerie'
                  width={50}
                  height={50}
                />
              </div>

              <Link
                href={'/'}
                className='text-xs font-regular uppercase pl-2 self-center'
              >
                Pijamas{' '}
                <span className='text-[11px] text-fontColor font-light'>
                  (39)
                </span>
                <p className='text-secondary text-[11px] capitalize font-normal'>
                  Mostrar Todas
                </p>
              </Link>
            </div>{' '}
            <div className='flex rounded-md border border-light hover:border-slate-400 p-2'>
              <div className='flex'>
                <Image
                  src='/icons/boy.svg'
                  alt='icone de lingerie'
                  width={50}
                  height={50}
                />
              </div>

              <Link
                href={'/'}
                className='text-xs font-regular uppercase pl-2 self-center'
              >
                Para o seu Boy{' '}
                <span className='text-[11px] text-fontColor font-light'>
                  (26)
                </span>
                <p className='text-secondary text-[11px] capitalize font-normal'>
                  Mostrar Todas
                </p>
              </Link>
            </div>
            <div className='flex rounded-md border border-light hover:border-slate-400 p-2'>
              <div className='flex'>
                <Image
                  src='/icons/acessorios.svg'
                  alt='icone de lingerie'
                  width={50}
                  height={50}
                />
              </div>

              <Link
                href={'/'}
                className='text-xs font-regular uppercase pl-2 self-center'
              >
                Acessórios{' '}
                <span className='text-[11px] text-fontColor font-light'>
                  (22)
                </span>
                <p className='text-secondary text-[11px] capitalize font-normal'>
                  Mostrar Todas
                </p>
              </Link>
            </div>
          </div>
        </div>

        <section className='flex mt-2'>
          <Sidebar />
          <ProductList />
        </section>
      </Container>
    </>
  );
};
export default Home;
