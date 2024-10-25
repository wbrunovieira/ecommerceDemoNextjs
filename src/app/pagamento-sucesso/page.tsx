'use client';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useCartStore } from '@/context/store';
import axios from 'axios';
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks';
import SuspenseWrapper from '@/components/SuspenseWrapper';

const SuccessPage = () => {
    const [collection_id, setCollectionId] = useState<string | null>(null);
    const [merchantOrderId, setMerchantOrderId] = useState<string | null>(null);
    const [cartId, setCartId] = useState<string | null>(null);
    const clearStorage = useCartStore((state) => state.clearStorage);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        setCollectionId(searchParams.get('collection_id'));
        setMerchantOrderId(searchParams.get('merchant_order_id'));
        setCartId(searchParams.get('external_reference'));
    }, []);

    console.log('sendCollectionIdToBackend cartId', cartId);

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

    const sendCollectionIdToBackend = useCallback(async () => {
        if (!collection_id || !cartId) return;
        console.log('sendCollectionIdToBackend cartId', cartId);
        try {
            const response = await axios.post(
                `${BASE_URL}/shipping/payment-success`,
                {
                    cartId,
                    collection_id,
                    merchantOrderId,
                }
            );
            console.log('Resposta do backend:', response.data);
        } catch (error) {
            console.error(
                'Erro ao enviar collection_id para o backend:',
                error
            );
        }
    }, [BASE_URL, collection_id, cartId, merchantOrderId]);

    useEffect(() => {
        console.log('Current cartId:', cartId);
    }, [cartId]);

    useEffect(() => {
        sendCollectionIdToBackend();
        clearStorage();
    }, [sendCollectionIdToBackend, clearStorage]);

    return (
        <SuspenseWrapper>
            <div className="bg-linear-gradient flex items-center justify-center min-h-screen">
                <div className="flex flex-col text-left z-10 bg-white p-8 border-2 border-y-primaryDark rounded-lg shadow-lg m-8 max-w-lg w-full">
                    <div className="flex items-center justify-center mb-2">
                        <AiOutlineCheckCircle className="text-green-500 text-5xl" />
                        <h1 className="text-lg md:text-3xl text-primaryDark font-bold text-center animate-fade-in">
                            Pagamento Efetuado com Sucesso!
                        </h1>
                    </div>
                    <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mt-1 w-full" />
                    <p className="text-primaryDark text-sm md:text-base mt-4 text-left">
                        Em breve você receberá um e-mail de confirmação do seu
                        pedido. <br />O e-mail será enviado dentro de 24 horas.
                    </p>
                    <p className="text-primaryDark text-sm md:text-base text-left mt-1">
                        Obrigado por comprar com a gente. Se precisar de ajuda,
                        não hesite em nos contatar.
                    </p>
                    <button className="bg-primary text-white font-semibold py-2 px-4 rounded-lg mt-6 transform hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out">
                        Ver Detalhes do Pedido
                    </button>
                    <button className="bg-secondary text-white font-semibold py-2 px-4 rounded-lg mt-4 transform hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out">
                        Continuar Comprando
                    </button>
                    <Fireworks autorun={{ speed: 3, duration: 5 }} />
                </div>
            </div>
        </SuspenseWrapper>
    );
};

export default SuccessPage;
