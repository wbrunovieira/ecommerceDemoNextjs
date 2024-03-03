'use client';
import Image from 'next/image';
import Button from './Button';

import { useRef, useEffect } from 'react';
import { register } from 'swiper/element/bundle';

register();

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/virtual';
import Navigation from 'swiper';

interface ProductProps {
  title: string;
  images: string[];
  description: string;
  price: number;
  id: string;
  material?: string;
  categoria: string;
  fabricante: string;
}

const Product: React.FC<ProductProps> = ({
  title,
  images,
  description,
  price,
  id,
  material,
  categoria,
  fabricante,
}) => {
  const swiperElRef = useRef(null);

  useEffect(() => {
    if (swiperElRef.current) {
      (swiperElRef.current as HTMLElement).addEventListener(
        'swiperprogress',
        (e) => {
          const [swiper, progress] = (e as CustomEvent).detail;
          console.log(progress);
        }
      );

      (swiperElRef.current as HTMLElement).addEventListener(
        'swiperslidechange',
        (e) => {
          console.log('slide changed');
        }
      );
    }
  }, []);
  return (
    <div className='flex flex-col ml-4'>
      <div className='w-full'>
        <h2 className='text-2xl font-bold mb-4 w-full'>{title}</h2>
      </div>

      <div className='flex flex-col md:flex-row'>
        <div className='md:w-1/2 flex flex-col'>
          <div className='flex flex-wrap md:flex-nowrap flex-col'>
            <Image
              src={images[0]}
              alt='Main Product Image'
              className='w-full h-auto object-cover mb-4'
              width={300}
              height={300}
            />
            <div className='swiper-container md:w-1/2'>
              <Swiper
                slidesPerView={3}
                navigation={true}
                pagination={{ clickable: true }}
              >
                {images.slice(1).map((image, index) => (
                  <SwiperSlide key={index}>
                    <Image
                      src={image}
                      alt={`Product Image ${index + 2}`}
                      width={100}
                      height={100}
                      layout='responsive'
                      className='w-full h-auto object-cover'
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2 p-4'>
          <div className='flex w-96'>
            <p className='mt-4'>{description}</p>
          </div>
          <div className='flex gap-4 mt-8'>
            <Image
              src='/icons/heart-icon.svg'
              alt='Heart Icon'
              width={20}
              height={20}
            />
            <span className='text-xs font-light'>Adicionar aos Favoritos</span>
          </div>
          <div className='mt-8 border border-light rounded px-8 py-2 max-w-48'>
            <h3 className='text-lg font-bold'>Cores</h3>

            <div className='flex gap-2'>
              <div className='w-4 h-4 rounded-full bg-[#ff0000]'></div>
              <div className='w-4 h-4 rounded-full bg-[#000000]'></div>
              <div className='w-4 h-4 rounded-full border border-[#243c5a] bg-[#ffffff]'></div>
              <div className='w-4 h-4 rounded-full bg-[#00ff00]'></div>
              <div className='w-4 h-4 rounded-full bg-[#fff00f]'></div>
            </div>
          </div>
          <div className='border border-light rounded px-8 py-2 max-w-48'>
            <p>R$ {price},00</p>
          </div>
          <div className='border border-light rounded px-4 py-2 max-w-96'>
            <div className='flex bg-[#EDEDED] w-20'>
              <p className='px-4 py-2 flex justify-center items-center  border-[#550000] border-2 '>
                1
              </p>
              <div className='flex bg-[#EDEDED] border-[#550000] border border-l-0  '>
                <button className='text-base font-light px-4 py-2'>+</button>
                <button className='text-base font-light px-4 py-2'>-</button>
              </div>
              <div className='flex p-4'>
                <p className=' whitespace-nowrap'>Adcionar Ao Carrinho</p>
              </div>
            </div>
          </div>
          <div className='flex flex-col mt-8 border border-light rounded px-8 py-2 w-52 text-xs text-[#676666] '>
            <div className='flex gap-2 '>
              <p>SKU</p>
              <p>{id}</p>
            </div>
            <div className='flex gap-2'>
              <p>Material</p>
              <p>{material}</p>
            </div>

            <div className='flex gap-2'>
              <p>Categoria</p>
              <p>{categoria}</p>
            </div>
            <div className='flex gap-2'>
              <p>Fabricante</p>
              <p>{fabricante}</p>
            </div>
          </div>
          <div className='flex w-96 mt-4'>
            <Button variant='secondary' size='small'>
              Comprar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
