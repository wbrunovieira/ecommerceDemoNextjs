'use client';
import Image from 'next/image';
import React from 'react';

interface FloatCartProps {
  onClose: () => void; // Adiciona a propriedade onClose como uma função que não retorna nada
}

const FloatCart: React.FC<FloatCartProps> = ({ onClose }) => {
  const handleClickOutside = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).classList.contains('modal-background')) {
      onClose();
    }
  };
  return (
    <div
      className='fixed top-28 right-2 flex items-center justify-center z-50 bg-primaryLight border rounded-md shadow-xl border-secondary bg-opacity-50'
      onClick={handleClickOutside}
    >
      <div
        className='relative bg-white rounded-lg shadow-xl p-6 mb-4 max-w-lg w-full'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className='text-xl text-primaryDark font-semibold'
        >
          X
        </button>

        <div className='flex justify-center items-center gap-2  border-b-2 border-light pb-4'>
          <h2 className='text-xl font-bold'>Carrinho - </h2>
          <span className='fontbold text-xl'>3 itens</span>
        </div>
        <div className='flex flex-col pt-4'>
          {/* Cart items */}
          <div className='flex items-center mb-4'>
            <Image
              src='/images/liz1.webp'
              alt='Item 1'
              width={24}
              height={24}
              className='w-12 h-12 rounded mr-4'
            />
            <div className='flex justify-center items-center gap-2'>
              <p className='text-xs font-medium'>Calcinha Biquini 50030</p>
              <p className='text-xs text-gray-500'>R$ 100,00</p>
            </div>
          </div>

          <div className='flex items-center mb-4'>
            <Image
              src='/images/liz1.webp'
              alt='Item 1'
              width={24}
              height={24}
              className='w-12 h-12 rounded mr-4'
            />
            <div className='flex justify-center items-center gap-2'>
              <p className='text-xs font-medium'>Calcinha Biquini 50030</p>
              <p className='text-xs text-gray-500'>R$ 400,00</p>
            </div>
          </div>
          <div className='flex items-center mb-4'>
            <Image
              src='/images/liz1.webp'
              alt='Item 1'
              width={24}
              height={24}
              className='w-12 h-12 rounded mr-4'
            />
            <div className='flex justify-center items-center gap-2'>
              <p className='text-xs font-medium'>Calcinha Biquini 50030</p>
              <p className='text-xs text-gray-500'>R$ 100,00</p>
            </div>
          </div>
          {/* Repeat the above structure for other cart items */}
        </div>
        <div className='flex flex-col justify-center align-center mt-4 border-t-2 border-light'>
          <div className='w-full flex justify-end items-center'>
            <p className='text-xl font-medium mt-4'>Total: R$ 100,00</p>
          </div>
          <button className='bg-primary text-white px-4 py-2 mt-2 rounded'>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatCart;
