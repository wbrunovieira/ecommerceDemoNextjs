'use client';
import SuspenseWrapper from '@/components/SuspenseWrapper';
import { useToast } from '@/components/ui/use-toast';
import { useSearchParams } from 'next/navigation';

import { useEffect, useState } from 'react';

const VerifyEmail = () => {
    const { toast } = useToast();

    const [verificationStatus, setVerificationStatus] = useState<
        'verifying' | 'success' | 'failure'
    >('verifying');

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get('token');

        if (token) {
            const url = `${BASE_URL}/accounts/verify/${token}`;
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        setVerificationStatus('success');
                        toast({
                            title: 'E-mail verificado com sucesso!',
                            description: 'Obrigado por confirmar seu e-mail.',
                            style: { background: '#006961' },
                        });
                    } else {
                        setVerificationStatus('failure');
                        toast({
                            title: 'Falha na verificação do e-mail.',
                            description:
                                'Não conseguimos verificar seu e-mail. Por favor, tente novamente.',
                            style: { background: '#ff6961' },
                        });
                    }
                })
                .catch((error) => {
                    console.error('Erro na verificação do e-mail:', error);
                    setVerificationStatus('failure');
                    toast({
                        title: 'Erro na verificação do e-mail.',
                        description:
                            'Ocorreu um erro durante a verificação. Por favor, tente novamente.',
                        style: { background: '#ff6961' },
                    });
                });
        } else {
            setVerificationStatus('failure');
            toast({
                title: 'Token não encontrado.',
                description:
                    'Parece que o link de verificação está incompleto. Por favor, verifique o link e tente novamente.',
                style: { background: '#ff6961' },
            });
        }
    }, [toast, BASE_URL]);

    return (
        <SuspenseWrapper>
            <div className="flex md:min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 mt-6 p-10 sm:p-6 lg:p-8">
                <div className="bg-white dark:bg-dark-secondary-gradient p-6 sm:p-8 lg:p-10 border-y-primaryDark rounded-lg shadow-lg z-10 relative overflow-hidden w-full md:w-3/5 text-center">
                    {verificationStatus === 'verifying' && (
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                            Verificando seu e-mail...
                        </p>
                    )}
                    {verificationStatus === 'success' && (
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                            E-mail verificado com sucesso!
                        </p>
                    )}
                    {verificationStatus === 'failure' && (
                        <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                            Falha na verificação do e-mail.
                        </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                        {verificationStatus === 'verifying'
                            ? 'Por favor, aguarde enquanto verificamos seu e-mail...'
                            : verificationStatus === 'success'
                            ? 'Sua conta já está pronta para ser utilizada.'
                            : 'Por favor, verifique o link ou entre em contato com o suporte.'}
                    </p>
                </div>
            </div>
        </SuspenseWrapper>
    );
};

export default VerifyEmail;
