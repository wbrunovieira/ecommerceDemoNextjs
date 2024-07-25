'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import axios from 'axios';
import { useCartStore } from '@/context/store';

const MelhorEnvioCallback = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const { data: session } = useSession();
    const [error, setError] = useState('');

    let token;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

    const calculateShipment = async (token: string) => {
        const { cartItems, selectedAddress } = useCartStore((state) => ({
            cartItems: state.cartItems,
            selectedAddress: state.selectedAddress,
        }));
        console.log('Current cart items:', cartItems);
        console.log('Current selected address:', selectedAddress);

        console.log(
            'Shipment calculation cartItems:selectedAddress',
            cartItems,
            selectedAddress
        );

        if (!cartItems.length || !selectedAddress) {
            console.error('Cart items or selected address is missing');
            return;
        }

        try {
            const response = await fetch(
                'https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                        'ngrok-skip-browser-warning': '69420',
                    },
                    body: JSON.stringify({
                        token,
                        cartItems,
                        selectedAddress,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to calculate shipment');
            }

            const result = await response.json();
            console.log('Shipment calculation result:', result);
            return result;
        } catch (error) {
            console.error('Error calculating shipment:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchAccessToken = async () => {
            const code = searchParams.get('code');
            console.log('code ', code);

            if (code) {
                try {
                    const response = await axios.post(
                        `${BASE_URL}/sessions/request-token`,
                        {
                            code,
                        }
                    );

                    console.log('response ', response);

                    if (response.status === 201) {
                        console.log(
                            'response.data.success ',
                            response.data.success
                        );

                        token = response.data.access_token;
                        console.log('token ', token);

                        const result = await calculateShipment(token);
                        console.log('result ', result);

                        // router.replace('/entrega');
                    }
                } catch (err) {
                    setError('Erro ao tentar obter o token de acesso.');
                }
            }
        };

        fetchAccessToken();
    }, [router, searchParams]);

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-primaryLight p-8 rounded-lg shadow-lg z-10 relative overflow-hidden lg:p-16 md:p-12 sm:w-full">
                <div className="relative z-10 bg-primary p-8 border-2 border-y-primaryDark rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-secondary mb-4">
                        Callback Melhor Envio
                    </h2>
                    {error && (
                        <p className="text-red-500 text-xs italic mb-4">
                            {error}
                        </p>
                    )}
                    <p className="text-white mb-4">
                        Estamos processando sua autorização. Por favor,
                        aguarde...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MelhorEnvioCallback;
