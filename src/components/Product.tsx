'use client';
import Image from 'next/image';
import Button from './Button';

import { useRef, useEffect, useState } from 'react';
import { register } from 'swiper/element/bundle';

register();

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/virtual';
import Navigation from 'swiper';
import Pagination from 'swiper';
import Autoplay from 'swiper';

import 'swiper/css/pagination';

import SimilarProducts from './SimilarProducts';

interface ProductProps {
  title: string;
  images: string[];
  description: string;
  price: number;
  id: string;
  material?: string;
  categoria: string;
  fabricante: string;
  color?: string[];
  size?: string[];
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
  color,
  size,
}) => {
  const swiperElRef = useRef(null);
  const [mainImage, setMainImage] = useState(images[0]);

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

  const similarProducts = [
    { image: '/images/liz1.webp', title: 'Sutiã', price: 120 },
    { image: '/images/liz2.webp', title: 'Sutiã2', price: 130 },
    { image: '/images/liz3.webp', title: 'Sutiã3', price: 140 },
    { image: '/images/liz4.webp', title: 'Sutiã4', price: 150 },
  ];
  return (
    <section>
      <div className='flex flex-col ml-4'>
        <div className='w-full'>
          <h2 className='text-2xl font-bold mb-2 w-full'>{title}</h2>
        </div>

        <div className='flex flex-col md:flex-row'>
          <div className='md:w-1/2 flex flex-col'>
            <div className='flex flex-wrap md:flex-nowrap flex-col h-10'>
              <Image
                src={mainImage}
                alt='Main Product Image'
                className='mb-4 border rounded-lg'
                width={350}
                height={350}
              />

              <div className='swiper-container md:w-1/2'>
                <Swiper
                  slidesPerView={3}
                  navigation={true}
                  pagination={{ clickable: true }}
                  spaceBetween={20}
                  centeredSlides={true}
                  autoplay
                >
                  {images.slice(1).map((image, index) => (
                    <SwiperSlide
                      key={index}
                      onClick={() => setMainImage(image)}
                      className='mySlide'
                    >
                      <Image
                        src={image}
                        alt={`Product Image ${index + 2}`}
                        width={150}
                        height={150}
                        className='w-10 object-cover cursor-pointer'
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
              <span className='text-xs font-light'>
                Adicionar aos Favoritos
              </span>
            </div>
            <div className='mt-8 border border-light rounded px-8 py-2 max-w-48'>
              <h3 className='text-lg font-bold'>Cores</h3>

              <div className='flex gap-2'>
                {color?.map((colorValue, index) => (
                  <div
                    key={index}
                    className='w-4 h-4 rounded-full '
                    style={{ backgroundColor: colorValue }}
                  ></div>
                ))}
              </div>
            </div>
            <div className='mt-8 flex-initial border border-light rounded px-8 py-2 max-w-64'>
              <h3 className='text-lg font-bold'>Tamanhos</h3>

              <div className='flex gap-2 justify-start p-2 w-60'>
                {size?.map((sizeValue, index) => (
                  <div key={index} className='border border-light rounded p-2'>
                    {sizeValue}
                  </div>
                ))}
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
                <p className='font-semibold'>SKU: </p>
                <p>{id}</p>
              </div>
              <div className='flex gap-2'>
                <p className='font-semibold'>Material: </p>
                <p>{material}</p>
              </div>

              <div className='flex gap-2'>
                <p className='font-semibold'>Categoria: </p>
                <p>{categoria}</p>
              </div>
              <div className='flex gap-2'>
                <p className='font-semibold'>Fabricante: </p>
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
      <div className='flex flex-col gap-2 w-auto'>
        <div className='w-full flex  '>
          <h2 className='text-lg text-primaryDark font-semibold border border-light rounded p-4 whitespace-nowrap'>
            Produtos Parecidos
          </h2>
        </div>
        <div className='flex gap-4 w-[64rem]'>
          <Swiper
            slidesPerView={3}
            navigation={true}
            pagination={{ clickable: true }}
            spaceBetween={20}
            centeredSlides={true}
            autoplay
          >
            {similarProducts.map((product, index) => (
              <SwiperSlide key={index}>
                <SimilarProducts
                  image={product.image}
                  title={product.title}
                  price={product.price}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          {/* <SimilarProducts
            image='/images/liz1.webp'
            title='Sutia'
            price={120}
          />
          <SimilarProducts
            image='/images/liz1.webp'
            title='Sutia'
            price={120}
          />
          <SimilarProducts
            image='/images/liz1.webp'
            title='Sutia'
            price={120}
          />
          <SimilarProducts
            image='/images/liz1.webp'
            title='Sutia'
            price={120}
          /> */}
          {/* <SimilarProducts
            image='/images/liz1.webp'
            title='Sutia'
            price={120}
          />
          <SimilarProducts
            image='/images/liz1.webp'
            title='Sutia'
            price={120}
          />
          <SimilarProducts
            image='/images/liz1.webp'
            title='Sutia'
            price={120}
          />
          <SimilarProducts
            image='/images/liz1.webp'
            title='Sutia'
            price={120}
          />
          <SimilarProducts
            image='/images/liz1.webp'
            title='Sutia'
            price={120}
          /> */}
        </div>
      </div>
    </section>
  );
};

export default Product;
