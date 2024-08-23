'use client';
import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useCartStore } from '@/context/store';
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks';
import { AiOutlineCheckCircle } from 'react-icons/ai';

const SuccessPage = () => {
    const searchParams = useSearchParams();
    const collection_id = searchParams.get('collection_id');
    const merchant_order_id = searchParams.get('merchant_order_id');
    const clearStorage = useCartStore((state) => state.clearStorage);
    const cartId = useCartStore((state) => state.cartId);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

    console.log('cartId out', cartId);
    useEffect(() => {
        if (collection_id && cartId) {
            const sendCollectionIdToBackend = async () => {
                try {
                    console.log('collection_id', collection_id);
                    console.log('cartId', cartId);
                    const response = await axios.post(
                        `${BASE_URL}/shipping/payment-success`,
                        {
                            collection_id,
                            cartId,
                            merchant_order_id,
                        }
                    );

                    console.log('Resposta do backend:', response.data);
                } catch (error) {
                    console.error(
                        'Erro ao enviar collection_id para o backend:',
                        error
                    );
                }
            };

            sendCollectionIdToBackend();
            clearStorage();
        }
    }, [collection_id, cartId]);

    return (
        // <div className="bg-linear-gradient flex items-center justify-center">
        //     <div className="flex flex-col text-left z-10 bg-white p-8 border-2 border-y-primaryDark rounded-lg shadow-lg m-4">
        //         <h1 className="text-lg md:text-3xl text-primaryDark font-bold text-center ">
        //             Pagamento Efetuado com Sucesso !
        //         </h1>
        //         <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mt-1 w-full" />
        //         <p className="text-primaryDark text-xs md:text-sm mt-4 text-left">
        //             Em breve você irá receber um email de confirmação do seu
        //             pedido.
        //         </p>
        //         <p className="text-primaryDark text-xs md:text-sm text-left mt-1">
        //             Obrigado por comprar com a gente.
        //         </p>
        //         <Fireworks autorun={{ speed: 3, duration: 5 }} />
        //     </div>
        // </div>
        <div className="bg-linear-gradient flex items-center justify-center ">
            {' '}
            <div className="flex flex-col text-left z-10 bg-white p-8 border-2 border-y-primaryDark rounded-lg shadow-lg m-8 max-w-lg w-full">
                {' '}
                <div className="flex items-center justify-center mb-2">
                    {' '}
                    <AiOutlineCheckCircle className="text-green-500 text-5xl " />{' '}
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
                    Obrigado por comprar com a gente. Se precisar de ajuda, não
                    hesite em nos contatar.
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
    );
};

export default SuccessPage;
