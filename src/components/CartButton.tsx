// src/components/CartButton.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { BsCart4 } from 'react-icons/bs';
import FloatCart from './FloatCart';
import { useCartStore } from '@/context/store';
import { useSession } from 'next-auth/react';

const CartButton = () => {
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isCartLoaded, setIsCartLoaded] = useState(false);

    const cartItems = useCartStore((state: any) => state.cartItems);
    const initializeCart = useCartStore((state: any) => state.initializeCart);
    const setUser = useCartStore((state) => state.setUser);
    const { data: session } = useSession();

    const toggleCartModal = () => {
        setIsCartModalOpen(!isCartModalOpen);
    };


useEffect(() => {
  if (session?.user?.id) {
    setUser(session.user.id);
    initializeCart([], session.user.id);
  }
}, [session, setUser, initializeCart]);

  useEffect(() => {
    setIsClient(true);
  }, []);

    return (
        <>
            <button
                onClick={toggleCartModal}
                className="flex items-center justify-center hover:scale-110 transition duration-300 bg-primaryLight rounded-md p-2 h-10 w-12"
            >
                <div className="relative text-primary2">
                    <BsCart4 className="text-primary2  w-5 h-5 md:w-6 md:h-6" />
                    {isCartLoaded && (
                        <span className="absolute text-primary2 -bottom-2 -right-4 opacity-70 bg-primaryLight border border-primary2 font-bold text-[10px] rounded-full px-2 py-2 min-w-[20px] h-[20px] flex items-center justify-center">
                            {cartItems.length}
                        </span>
                    )}
                </div>
            </button>
            {isCartModalOpen && <FloatCart onClose={toggleCartModal} />}
        </>
    );
};

export default CartButton;
