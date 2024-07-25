'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useCartStore } from '@/context/store';

const ShippingOptions = () => {
    const { data: session, status } = useSession();
    const [shippingOptions, setShippingOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { cartItems, selectedAddress } = useCartStore();

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

    useEffect(() => {
        const fetchShippingOptions = async () => {
            setLoading(true);
            try {
                const response = await axios.post(
                    `${BASE_URL}/cart/calculate-shipment`,
                    {
                        // token,
                        cartItems,
                        selectedAddress,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            'ngrok-skip-browser-warning': '69420',
                        },
                    }
                );
                console.log('fetchShippingOptions response', response);
                setShippingOptions(response.data);
            } catch (error) {
                setError('Erro ao obter as opções de frete.');
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchShippingOptions();
        }
    }, [status]);

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-primaryLight p-8 rounded-lg shadow-lg z-10 relative overflow-hidden lg:p-16 md:p-12 sm:w-full">
                <div className="relative z-10 bg-primary p-8 border-2 border-y-primaryDark rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-secondary mb-4">
                        Opções de Frete
                    </h2>
                    {loading && (
                        <p className="text-white mb-4">Carregando...</p>
                    )}
                    {error && (
                        <p className="text-red-500 text-xs italic mb-4">
                            {error}
                        </p>
                    )}
                    {!loading && !error && (
                        <ul className="text-white">
                            {/* {shippingOptions.map((option, index) => (
                                <li key={index} className="mb-4">
                                    <p>
                                        <strong>Nome:</strong> {option.name}
                                    </p>
                                    <p>
                                        <strong>Preço:</strong> R${' '}
                                        {option.price.toFixed(2)}
                                    </p>
                                    <p>
                                        <strong>Tempo de Entrega:</strong>{' '}
                                        {option.deliveryTime}
                                    </p>
                                </li>
                            ))} */}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShippingOptions;
