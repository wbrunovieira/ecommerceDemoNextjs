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
        setIsClient(true);

        const initializeUserCart = async () => {
            if (session?.user?.id) {
                setUser(session.user.id);
                const cartInit = await initializeCart([], session.user.id);
                setIsCartLoaded(true);
                console.log('initializeUserCart no float cartInit', cartInit);
            }
        };
        initializeUserCart();
    }, [session, setUser, initializeCart]);

    if (!isClient) return null;

    return (
        <>
            <button
                onClick={toggleCartModal}
                className="flex items-center justify-center hover:scale-110 transition duration-300 bg-primaryLight rounded-full p-2 h-12 w-12"
            >
                <div className="relative">
                    <BsCart4 size={32} />
                    {isCartLoaded && (
                        <span className="absolute -bottom-2 -right-4 opacity-70 bg-primaryDark text-primaryLight border border-primaryDark text-[10px] rounded-full px-2 py-2 min-w-[20px] h-[20px] flex items-center justify-center">
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
