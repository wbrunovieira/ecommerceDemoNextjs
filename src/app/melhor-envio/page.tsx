'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const MelhorEnvioAuthorize = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/login');
        }
    }, [status, router]);

    const handleAuthorize = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.get(
                `${BASE_URL}/sessions/melhor-envio/auth-url `
            );
            console.log('response', response);
            console.log('response.data.authUrl', response.data.authUrl);
            if (response.data.authUrl) {
                window.location.href = response.data.authUrl;
            } else {
                setError('Erro ao tentar autorizar o Melhor Envio.');
            }
        } catch (err) {
            setError('Erro ao tentar autorizar o Melhor Envio.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-primaryLight p-8 rounded-lg shadow-lg z-10 relative overflow-hidden lg:p-16 md:p-12 sm:w-full">
                <div className="relative z-10 bg-primary p-8 border-2 border-y-primaryDark rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-secondary mb-4">
                        Autorizar Melhor Envio
                    </h2>

                    <p className="text-white mb-4">
                        Clique no botão abaixo para autorizar o acesso ao Melhor
                        Envio.
                    </p>

                    {error && (
                        <p className="text-red-500 text-xs italic mb-4">
                            {error}
                        </p>
                    )}

                    <button
                        onClick={handleAuthorize}
                        disabled={isLoading}
                        className="bg-secondary text-white-important flex items-center justify-center px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark transition duration-300 hover:scale-105"
                    >
                        {isLoading ? (
                            <svg
                                className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-3xl"
                                viewBox="0 0 24 24"
                            ></svg>
                        ) : (
                            'Autorizar Melhor Envio'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MelhorEnvioAuthorize;
