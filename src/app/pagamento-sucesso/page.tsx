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
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-primaryLight p-8 rounded-lg shadow-lg z-10 relative overflow-hidden lg:p-16 md:p-12 sm:w-full">
                <div className="relative z-10 bg-primary p-8 border-2 border-y-primaryDark rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center my-8">Pagamento Sucesso</h1>
                   
                </div>
            </div>
        </div>
    );
};

export default ShippingOptions;
