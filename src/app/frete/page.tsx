'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

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

interface ShippingOption {
    name: string;
    currency: string;
    delivery_time: number;
    price: number;
}

const FretePage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const cartItems = useCartStore((state: any) => state.cartItems);
    const cartId = useCartStore((state) => state.cartId);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(
        null
    );
    const initializeCart = useCartStore((state) => state.initializeCart);
    const setUser = useCartStore((state) => state.setUser);
    const createPreference = useCartStore((state) => state.createPreference);

    const { data: session } = useSession();
    const [error, setError] = useState('');
    const [isCartInitialized, setIsCartInitialized] = useState(false);
    const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>(
        []
    );
    const [loading, setLoading] = useState(true);
    const [preferenceId, setPreferenceId] = useState(null);

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
            calculateShipment();
        }
    }, [isCartInitialized]);

    const calculateShipment = async () => {
        const result = await calculateShipmentApi();
        setLoading(false);
        if (result && result.data) {
            setShippingOptions(result.data);
        }
    };

    const calculateShipmentApi = async () => {
        console.log('entrou calculateShipment cartItems', cartItems);

        let { address } = useCartStore
            .getState()
            .getCartItemsAndAddressForShipping();

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
        console.log('calculateShipment products', products);

        try {
            console.log('calculateShipment agora vamos mandar tudo', {
                cartItems: products,
                selectedAddress: address.zipCode,
            });
            const session = await getSession();
            const authToken = session?.accessToken;
            const response = await axios.post(
                `${BASE_URL}/cart/calculate-shipment`,
                { cartItems: products, selectedAddress: address },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                        Accept: 'application/json',
                    },
                }
            );
            console.log('Shipment calculation result:', response);

            if (!response) {
                throw new Error('Failed to calculate shipment');
            }

            return response;
        } catch (error) {
            console.error('Error calculating shipment:', error);
            throw error;
        }
    };

    const handleSelectShippingOption = async (option) => {
        console.log('handleSelectShippingOption', option);
        useCartStore.getState().setSelectedShippingOption(option);
        const userId = session!.user.id;
        cartId;

        if (!userId) {
            console.error('User ID is missing');
            return;
        }

        const shippingData = {
            userId: userId,
            cartId: cartId,
            name: option.name,
            shippingCost: parseFloat(option.price.toString()),
            deliveryTime: option.delivery_time,
        };
        console.log('handleSelectShippingOption shippingData', shippingData);

        try {
            const response = await axios.post(
                `${BASE_URL}/shipping/create`,
                shippingData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );

            console.log('handleSelectShippingOption', response);

            if (response.status === 201 || response.status === 200) {
                const uuid = uuidv4();
                if (!cartId) {
                    console.error('Cart ID is missing');
                    setError('Cart ID is not set. Please try again.');
                    return;
                }

                const preference = await createPreference(
                    cartId,
                    String(uuid),
                    option
                );

                setPreferenceId(preference.id);

                console.log(
                    'handleSelectShippingOption preference',
                    preference
                );

                console.log(
                    'handleSelectShippingOption preference.id',
                    preference.id
                );
                router.replace('/checkout');
            } else {
                console.error('Failed to create shipment:', response.data);
            }
        } catch (error) {
            console.error('Error creating shipment:', error);
        }

        router.replace('/checkout');
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-primaryLight p-8 rounded-lg shadow-lg z-10 relative overflow-hidden lg:p-16 md:p-12 sm:w-full">
                <div className="relative z-10 bg-primary p-8 border-2 border-y-primaryDark rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-secondary mb-4">
                        Opções de Frete
                    </h2>
                    {loading ? (
                        <p className="text-white mb-4">Carregando...</p>
                    ) : error ? (
                        <p className="text-red-500 text-xs italic mb-4">
                            {error}
                        </p>
                    ) : (
                        <ul className="text-white">
                            {shippingOptions.map((option, index) => (
                                <li
                                    key={index}
                                    onClick={() =>
                                        handleSelectShippingOption(option)
                                    }
                                    className="mb-2 p-2 border border-secondary rounded cursor-pointer hover:bg-secondaryDark"
                                >
                                    <p className="font-semibold">
                                        {option.name}
                                    </p>
                                    <p>Prazo: {option.delivery_time} dias</p>
                                    <p>
                                        Preço: {option.price} {option.currency}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FretePage;
