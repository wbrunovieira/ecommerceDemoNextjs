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
              '/images/foto1.jpg',
              '/images/foto2.jpg',
              '/images/foto3.jpg',
              '/images/foto4.jpg',
            ]}
            autoplay={true}
            direction='up'
          >
            <h1>teste</h1>
          </ImagesSlider>
        </div>
        <div className='grid grid-cols-4 gap-4 justify-center mt-2'>
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

        <section className='flex mt-2'>
          <Sidebar />
          <ProductList />
        </section>
      </Container>
    </>
  );
};
export default Home;
