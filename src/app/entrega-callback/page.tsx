'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const MelhorEnvioCallback = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const { data: session } = useSession();
    const [error, setError] = useState('');

    useEffect(() => {
        
        const fetchAccessToken = async () => {
            const code = searchParams.get('code');

            if (code) {
                try {
                    const response = await axios.post('/api/me-callback', {
                        code,
                    });
                    if (response.data.success) {
                        router.replace('/entrega'); 
                    } else {
                        setError('Erro ao tentar obter o token de acesso.');
                    }
                } catch (err) {
                    setError('Erro ao tentar obter o token de acesso.');
                }
            }
        };

        fetchAccessToken();
    }, [router]);

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
