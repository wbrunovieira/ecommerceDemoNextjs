'use client';
import React, { useState } from 'react';
import { BsCart4 } from 'react-icons/bs';
import FloatCart from './FloatCart';
import { useCartStore } from '@/context/store';

const CartButton = () => {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const cartItems = useCartStore((state: any) => state.cartItems);

  const toggleCartModal = () => {
    setIsCartModalOpen(!isCartModalOpen);
  };

  return (
    <>
      <button
        onClick={toggleCartModal}
        className='flex items-center justify-center hover:scale-110 transition duration-300 bg-primaryLight rounded-full p-2 h-12 w-12'
      >
        <div className='relative'>
          <BsCart4 size={32} />
          <span className='absolute -bottom-2 -right-4 opacity-70 bg-primaryDark text-primaryLight border border-primaryDark text-[10px] rounded-full px-2 py-2 min-w-[20px] h-[20px] flex items-center justify-center'>
            {cartItems.length}
          </span>
        </div>
      </button>
      {isCartModalOpen && <FloatCart onClose={toggleCartModal} />}
    </>
  );
};

export default CartButton;
