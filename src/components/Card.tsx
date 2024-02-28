import Image from 'next/image';
import React from 'react';
import Button from './Button';

interface CardProps {
  title: string;
  category: string;
  precoAntigo?: number;
  precoNovo: number;
  emPromocao?: boolean;
  desconto?: number;
  imageSRC: string;
}

const Card: React.FC<CardProps> = ({
  title,
  precoAntigo,
  precoNovo,
  emPromocao = false,
  desconto,
  imageSRC,
  category,
}) => {
  return (
    <div className='max-w-sm rounded  shadow-lg bg-white m-2'>
      <div className='relative overflow-hidden'>
        <Image
          className='w-full relative'
          src={imageSRC}
          width={400}
          height={300}
          alt={title}
        />
        {emPromocao && (
          <div className='absolute promocao1 transform rotate-45 translate-x-1/3 -translate-y-1/3 px-2 py-1 text-xs'>
            PROMOÇÃO
          </div>
        )}
        {desconto && <div className='descont-badge'>{`${desconto}%`}</div>}
        <div className='px-6 py-4'>
          <h3 className='font-regular text-xs text-primary'>{category}</h3>
          <h2 className='semibold text-xl mb-2 text-fontColor'>{title}</h2>
          <p className='text-gray-700 text-sm font-bold text-fontColor'>
            {precoAntigo && (
              <span className='line-through mr-2 font-extralight'>
                R${precoAntigo.toFixed(2)}
              </span>
            )}
            <span className='text-red-500'> R${precoNovo.toFixed(2)}</span>
          </p>
        </div>
        <div className='px-6 pt-4 pb-2'>
          <Button variant='secondary' size='small'>
            Comprar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Card;
