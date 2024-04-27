import Image from 'next/image';
import React, { SyntheticEvent } from 'react';
import Button from './Button';
import Link from 'next/link';
import { useCartStore } from '@/context/store';

interface CardProps {
  id: string;
  title: string;
  category: string;
  precoAntigo?: number;
  precoNovo: number;
  emPromocao?: boolean;
  eNovidade?: boolean;
  desconto?: number;
  imageSRC?: string;
}

interface ProductCart {
  id: string;
  quantity: number;
  title: string;
  image: string;
  precoNovo: number;
}
const Card: React.FC<CardProps> = ({
  id,
  title,
  precoAntigo,
  precoNovo,
  emPromocao = false,
  desconto,
  imageSRC,
  category,
  eNovidade,
}) => {
  const addToCart = useCartStore((state: any) => state.addToCart);

  const handleAddToCart = (product: ProductCart) => {
    addToCart({
      id: product.id,
      title: product.title,
      quantity: 1,
      image: validImageSRC,
      price: product.precoNovo,
    });
  };

  const validImageSRC = imageSRC
    ? imageSRC.startsWith('http')
      ? imageSRC
      : `/${imageSRC}`
    : '/images/foto1.jpg';

  return (
    <div className='max-w-sm rounded-md shadow-lg bg-white m-2 h-96 flex flex-col'>
      <div className='relative overflow-hidden flex-shrink-0 rounded-md'>
        <Image
          className='w-full'
          src={validImageSRC}
          width={400}
          height={300}
          alt={title}
          unoptimized
        />
        {emPromocao && (
          <div className='absolute promocao1 transform rotate-45 translate-x-1/3 -translate-y-1/3 px-2 py-1 text-xs uppercase'>
            PROMOÇÃO
          </div>
        )}
        {eNovidade && (
          <div className='absolute novidade transform rotate-45 translate-x-1/3 -translate-y-1/3 px-2 py-1 text-xs uppercase'>
            Novidade
          </div>
        )}
        {desconto && (
          <div className='relative'>
            <div className='absolute descont-badge'>{`${desconto}%`}</div>
          </div>
        )}
      </div>
      <div className='flex-1 px-6 py-4 flex flex-col justify-between'>
        <div>
          <h3 className='font-regular text-xs text-primary'>{category}</h3>
          <h2 className='semibold text-xl mb-2 text-fontColor'>{title}</h2>
          <p className='text-gray-700 text-sm font-bold text-fontColor'>
            {precoAntigo && (
              <span className='line-through mr-2 font-extralight'>
                R${precoAntigo.toFixed(2)}
              </span>
            )}
            <span className='text-red-500'>R${precoNovo}</span>
          </p>
        </div>
        <div className='pb-2'>
          <Link href='/product/ '>
            <Button
              variant='secondary'
              size='small'
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart({
                  id,
                  title,
                  quantity: 1,
                  image: validImageSRC,
                  precoNovo,
                });
              }}
            >
              Comprar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
