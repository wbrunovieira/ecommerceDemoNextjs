'use client';
import { useCartStore } from '@/context/store';
import Image from 'next/image';
import React from 'react';
import { BsTrash } from 'react-icons/bs';

interface FloatCartProps {
  onClose: () => void;
}

interface Product {
  id: string;
  quantity: number;
  title: string;
  image: string;
  price: number;
}

const FloatCart: React.FC<FloatCartProps> = ({ onClose }) => {
  const cartItems = useCartStore((state: any) => state.cartItems);
  const removeFromCart = useCartStore((state: any) => state.removeFromCart);
  const handleClickOutside = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).classList.contains('modal-background')) {
      onClose();
    }
  };

  return (
    <div
      className='fixed top-28 right-2 flex items-center justify-center z-50 bg-primaryLight border rounded-md shadow-xl border-secondary bg-opacity-80'
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

        <div className='flex justify-center items-center gap-2 border-b-2 border-light pb-4'>
          <h2 className='text-xl font-bold'>Carrinho - </h2>
          <span className='fontbold text-xl'>{cartItems.length} itens</span>
        </div>

        <ul className='flex flex-col pt-4'>
          <li className='flex justify-between items-center gap-4 border-b-2 border-light pb-4 text-sm'>
            <p>Imagem</p>
            <p>Qt</p>
            <p>Descrição</p>
            <p>Unit R$</p>
            <p>Total R$</p>
            <p>Ação</p>
          </li>
          {cartItems.map((item: Product, index: number) => (
            <li
              key={index}
              className='flex justify-between items-center mb-4 gap-2'
            >
              <Image
                src={item.image}
                alt={item.title}
                width={20}
                height={20}
                className='w-12 h-12 rounded'
              />
              <p className='text-sm font-medium'>{item.quantity} pç</p>
              <p className='text-sm font-medium'>{item.title}</p>
              <p className='text-sm text-gray-500'>R$ {item.price},00</p>
              <p className='text-sm font-bold'>
                R$ {item.quantity * item.price},00
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                className='bg-red-500 text-white p-1 rounded'
              >
                <BsTrash size={14} />
              </button>
            </li>
          ))}
        </ul>

        <div className='flex flex-col justify-center align-center mt-4 border-t-2 border-light'>
          <div className='w-full flex justify-end items-center'>
            <p className='text-xl font-medium mt-4'>
              Total: R${' '}
              {cartItems.reduce(
                (acc: any, item: any) => acc + item.price * item.quantity,
                0
              )}
              ,00
            </p>
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
