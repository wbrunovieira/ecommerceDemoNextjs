'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useCartStore } from '@/context/store';
import WalletComponent from '@/components/WalletComponent';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

const CheckoutPage = () => {
    const { data: session, status } = useSession();
    const [shippingOptions, setShippingOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { cartItems, selectedAddress } = useCartStore();
    // const [preferenceId, setPreferenceId] = useState(null);
    const preferenceId = useCartStore((state) => state.preferenceId);
    if (!preferenceId) {
        return <div>Carregando...</div>;
    }
    const mercadoPagoPublicKey =
        process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY;

    if (mercadoPagoPublicKey) {
        initMercadoPago(mercadoPagoPublicKey);
    }
    console.log('mercadoPagoPublicKey', mercadoPagoPublicKey);
    console.log('preferenceId', preferenceId);

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg z-10 relative overflow-hidden lg:p-16 md:p-12 sm:w-full">
                <div className="relative z-10 bg-white p-8 border-2 border-y-primaryDark rounded-lg shadow-lg">
                    <h1 className="text-base md:text-3xl font-bold text-center  text-primaryDark">
                        Clique no botão azul abaixo para efetuar o pagamento
                    </h1>
                    <p className="text-xs md:text-sm text-center ">
                        eles são quase seus
                    </p>
                </div>
                <Wallet
                    initialization={{
                        preferenceId: preferenceId,
                    }}
                    customization={{ texts: { valueProp: 'smart_option' } }}
                />
            </div>
        </div>
    );
};

export default CheckoutPage;
