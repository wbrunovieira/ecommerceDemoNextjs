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
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-primaryLight p-8 rounded-lg shadow-lg z-10 relative overflow-hidden lg:p-16 md:p-12 sm:w-full">
                <div className="relative z-10 bg-primary p-8 border-2 border-y-primaryDark rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold text-center my-8">
                        Pagamento com Mercado Pago
                    </h1>

                    <Wallet
                        initialization={{ preferenceId: preferenceId }}
                        customization={{ texts: { valueProp: 'smart_option' } }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
