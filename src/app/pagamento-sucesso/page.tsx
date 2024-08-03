'use client';
import { useCallback, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useCartStore } from '@/context/store';
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks';

const SuccessPage = () => {
    const { data: session, status } = useSession();

    const { cartItems, selectedAddress } = useCartStore();

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-primaryLight p-8 rounded-lg shadow-lg z-10 relative overflow-hidden lg:p-16 md:p-12 sm:w-full">
                <div className="relative z-10 bg-primary p-8 border-2 border-y-primaryDark rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold text-center my-8">
                        Pagamento Efetuado com Sucesso
                    </h1>
                    <Fireworks autorun={{ speed: 3, duration: 5 }} />
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
