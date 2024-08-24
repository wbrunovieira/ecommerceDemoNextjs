'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useCartStore } from '@/context/store';
import WalletComponent from '@/components/WalletComponent';

const ShippingOptions = () => {
    const { data: session, status } = useSession();
    const [shippingOptions, setShippingOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { cartItems, selectedAddress } = useCartStore();

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;
    const preferenceId = '<PREFERENCE_ID>';
    return (
        <div className="bg-linear-gradient flex items-center justify-center md:min-h-screen mt-8">
            <div className="flex flex-col items-center justify-center z-10 bg-white p-8 border-2 border-y-primaryDark rounded-lg shadow-lg max-w-lg w-full md:w-auto mt-8">
                <div className="flex flex-col mb-2 w-full">
                    <h1 className="text-lg md:text-3xl text-primaryDark font-bold text-center animate-fade-in">
                        Pagamento Pendente
                    </h1>
                    <p className="text-sm md:text-lg text-gray-600 text-left mt-4">
                        Seu pagamento ainda está sendo processado.
                    </p>
                    <p className="text-sm md:text-lg text-gray-600 text-left ">
                        Não se preocupe, você será notificado assim que o
                        pagamento for confirmado.
                    </p>
                    <p className="text-sm md:text-lg text-gray-600 text-left mb-4">
                        Enquanto isso, você pode revisar seus detalhes de compra
                        ou escolher outro método de pagamento se desejar.
                    </p>
                    <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mt-1 w-full mb-6" />
                    <WalletComponent preferenceId={preferenceId} />
                </div>
            </div>
        </div>
    );
};

export default ShippingOptions;
