'use client';
import React, { useCallback, useEffect, useState } from 'react';

import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

import axios from 'axios';

import { useCartStore, useLoadingStore } from '@/context/store';
import LoadingHandler from '@/components/LoadingHandler';
import SuspenseWrapper from '@/components/SuspenseWrapper';

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
    const isLoading = useLoadingStore((state) => state.isLoading);
    const setLoading = useLoadingStore((state) => state.setLoading);
    const [loadingin, setLoadingin] = useState(true);
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

    const calculateShipmentApi = useCallback(async () => {
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
    }, [cartItems, BASE_URL]);

    const calculateShipment = useCallback(async () => {
        const result = await calculateShipmentApi();
        setLoading(false);
        if (result && result.data) {
            setShippingOptions(result.data);
            setLoadingin(false);
        }
    }, [calculateShipmentApi, setLoading, setShippingOptions, setLoadingin]);

    useEffect(() => {
        if (isCartInitialized) {
            calculateShipment();
        }
    }, [isCartInitialized, calculateShipment]);

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
    console.log('frete isLoading', isLoading);

    return (
        <SuspenseWrapper>
            <div className="flex items-center justify-center ">
                <div className="bg-white p-8 rounded-lg shadow-lg z-10 relative overflow-hidden overflow-auto max-w-full md:w-3/5 md:p-12 sm:w-full ">
                    <div className="relative z-10  p-8 border-2 border-y-primaryDark rounded-lg shadow-lg">
                        <h2 className="text-xs md:text-2xl font-bold text-secondary mb-4 whitespace-nowrap">
                            vamos escolher uma opção de frete:
                        </h2>
                        {loadingin ? (
                            <p className="text-primaryDark mb-4">
                                Carregando...
                            </p>
                        ) : error ? (
                            <p className="text-red-500 text-xs italic mb-4">
                                {error}
                            </p>
                        ) : (
                            <ul className="flex flex-col text-primaryDark w-full max-w-full">
                                {shippingOptions
                                    .filter(
                                        (option) =>
                                            option.price && option.delivery_time
                                    )
                                    .map((option, index) => (
                                        <li
                                            key={index}
                                            onClick={() =>
                                                handleSelectShippingOption(
                                                    option
                                                )
                                            }
                                            className="mb-2 p-2 border border-secondary rounded cursor-pointer hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out whitespace-nowrap flex w-full"
                                        >
                                            <div className="flex-grow flex flex-col  ">
                                                <div className="">
                                                    <span className="font-semibold text-xl">
                                                        {option.name}
                                                    </span>
                                                </div>
                                                <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light" />
                                                <div className="flex mt-1 text-[0.7rem] md:text-xs">
                                                    <span className="font-semibold">
                                                        Prazo:
                                                        <span className="ml-2 font-normal">
                                                            {
                                                                option.delivery_time
                                                            }{' '}
                                                        </span>
                                                        <span className="font-normal">
                                                            dias
                                                        </span>
                                                    </span>
                                                </div>

                                                <div className="flex mt-1 text-[0.7rem] md:text-xs">
                                                    <span className="font-bold">
                                                        Preço:
                                                        <span className="ml-2 font-normal">
                                                            {option.currency}{' '}
                                                            {option.price}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </div>
                    <LoadingHandler />
                </div>
            </div>
        </SuspenseWrapper>
    );
};

export default FretePage;
