'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { parseCookies, setCookie } from 'nookies';

import axios from 'axios';
import { useCartStore } from '@/context/store';

interface Address {
    _id: {
        value: string;
    };
    props: {
        userId: string;
        street: string;
        number: number;
        complement?: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
        createdAt: string;
        updatedAt: string;
    };
}

const MelhorEnvioCallback = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const cartItems = useCartStore((state: any) => state.cartItems);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(
        null
    );
    const initializeCart = useCartStore((state) => state.initializeCart);
    const setUser = useCartStore((state) => state.setUser);
    const { data: session } = useSession();
    const [error, setError] = useState('');
    const [isCartInitialized, setIsCartInitialized] = useState(false);

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

    useEffect(() => {
        const initializeUserCart = async () => {
            if (session?.user?.id) {
                setUser(session.user.id);
                await initializeCart([], session.user.id);
                setIsCartInitialized(true);
            }
        };
        initializeUserCart();
    }, [session, setUser, initializeCart]);

    useEffect(() => {
        if (isCartInitialized) {
            fetchAccessToken();
        }
    }, [isCartInitialized]);

    const fetchAccessToken = async () => {
        const code = searchParams.get('code');
        const cookies = parseCookies();
        const existingToken = cookies.melhorenvio_token;
        const refreshToken = cookies.melhorenvio_refresh_token;
        const tokenIsValid = isTokenValid();

        console.log('code ', code);
        console.log('existingToken ', existingToken);
        console.log('refreshToken ', refreshToken);

        if (existingToken && tokenIsValid) {
            try {
                console.log(
                    'entrou no ele existe existingToken e ta bao',
                    existingToken
                );
                const result = await calculateShipment(existingToken);
                console.log(
                    'entrou no ele existe existingToken result',
                    result
                );
                router.replace('/entrega');
                return;
            } catch (error) {
                console.error(
                    'Existing token failed, attempting to refresh...'
                );
            }
        }

        if (existingToken && !tokenIsValid && refreshToken) {
            try {
                const response = await axios.post(
                    `${BASE_URL}/auth/refresh-token`,
                    { refresh_token: refreshToken }
                );
                const {
                    access_token: newAccessToken,
                    refresh_token: newRefreshToken,
                    expires_in,
                } = response.data;
                const expiryDate = new Date(
                    new Date().getTime() + expires_in * 1000
                );

                setCookie(null, 'melhorenvio_token', newAccessToken, {
                    maxAge: expires_in,
                    path: '/',
                    sameSite: 'strict',
                });

                setCookie(null, 'melhorenvio_refresh_token', newRefreshToken, {
                    maxAge: 30 * 24 * 60 * 60, // 30 days
                    path: '/',
                    sameSite: 'strict',
                });

                setCookie(
                    null,
                    'melhorenvio_token_expiry',
                    expiryDate.toISOString(),
                    {
                        maxAge: expires_in,
                        path: '/',
                        sameSite: 'strict',
                    }
                );

                const result = await calculateShipment(newAccessToken);
                console.log('entrou no  refreshToken result', result);
                router.replace('/entrega');
                return;
            } catch (error) {
                console.error('Refreshing token failed:', error);
            }
        }

        if (!existingToken && code) {
            try {
                console.log('code entrou fo if code ', code);
                const response = await axios.post(
                    `${BASE_URL}/sessions/request-token`,
                    { code },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    }
                );

                console.log('response if code ', response.status);
                if (response.status === 201 || response.status === 200) {
                    const {
                        access_token,
                        refresh_token: newRefreshToken,
                        expires_in,
                    } = response.data;

                    const expiryDate = new Date(
                        new Date().getTime() + expires_in * 1000
                    );

                    console.log('newRefreshToken', newRefreshToken);
                    console.log('access_token', access_token);
                    console.log('expires_in', expires_in);

                    setCookie(null, 'melhorenvio_token', access_token, {
                        maxAge: expires_in,
                        path: '/',
                        sameSite: 'strict',
                    });

                    setCookie(
                        null,
                        'melhorenvio_refresh_token',
                        newRefreshToken,
                        {
                            maxAge: 30 * 24 * 60 * 60, // 30 days
                            path: '/',
                            sameSite: 'strict',
                        }
                    );

                    setCookie(
                        null,
                        'melhorenvio_token_expiry',
                        expiryDate.toISOString(),
                        {
                            maxAge: expires_in,
                            path: '/',
                            sameSite: 'strict',
                        }
                    );

                    console.log(
                        'quase calculateShipment access_token',
                        access_token
                    );
                    const result = await calculateShipment(access_token);
                    console.log('result calculateShipment ', result);

                    router.replace('/entrega');
                }
            } catch (err) {
                setError('Erro ao tentar obter o token de acesso.');
            }
        } else {
            setError('Authorization code is missing.');
        }
    };

    const calculateShipment = async (token: string) => {
        console.log('entrou calculateShipment', token);

        console.log('entrou calculateShipment cartItems', cartItems);

        let { address } = useCartStore
            .getState()
            .getCartItemsAndAddressForShipping();
        console.log(
            'entrou calculateShipment selectedAddress',
            selectedAddress
        );
        console.log('entrou calculateShipment address', address);

        if (!cartItems.length || !address) {
            console.error('Cart items or selected address is missing');
            return;
        }

        const products = cartItems.map((item) => ({
            id: item.id,
            width: item.width,
            height: item.height,
            length: item.length,
            weight: item.weight,
            insurance_value: item.price * item.quantity,
            quantity: item.quantity,
        }));

        address = selectedAddress
            ? { postal_code: selectedAddress.props.zipCode }
            : { postal_code: '' };

        try {
            const response = await axios.post(
                `${BASE_URL}/cart/calculate-shipment`,
                { cartItems: products, selectedAddress: address, token },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );

            if (!response) {
                throw new Error('Failed to calculate shipment');
            }

            console.log('Shipment calculation result:', response);
            return response;
        } catch (error) {
            console.error('Error calculating shipment:', error);
            throw error;
        }
    };

    const isTokenValid = () => {
        const cookies = parseCookies();
        const tokenExpiry = cookies.melhorenvio_token_expiry;
        if (!tokenExpiry) return false;

        const expiryDate = new Date(tokenExpiry);
        console.log('expiryDate > new Date() ', expiryDate > new Date());
        return expiryDate > new Date();
    };

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
