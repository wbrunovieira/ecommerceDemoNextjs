'use client';
import { useToast } from '@/components/ui/use-toast';
import { useSearchParams } from 'next/navigation';

import { useEffect, useState } from 'react';

const VerifyEmail = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [verificationStatus, setVerificationStatus] = useState<boolean>();

    const { toast } = useToast();

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

    console.log('verificationStatus', verificationStatus);
    console.log('token', token);

    useEffect(() => {
        if (token) {
            console.log('entrou no token');
            const url = `${BASE_URL}/accounts/verify/${token}`;
            console.log('entrou no token,url', url);
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        setVerificationStatus(true);
                        toast({
                            title: 'E-mail verificado com sucesso!',
                            description: 'verificação do e-mail. sucesso!',
                            style: { background: '#006961' },
                        });
                    } else {
                        setVerificationStatus(false);
                        toast({
                            title: 'Falha na verificação do e-mail.',
                            description: 'Falha na verificação do e-mail. ',
                            style: { background: '#ff6961' },
                        });
                    }
                });
        }
    }, [token, toast]);

    return (
        <div className="flex justify-center align-center">
            {verificationStatus === null && 'Verificando seu e-mail...'}
            {verificationStatus === true && 'E-mail verificado com sucesso!'}
            {verificationStatus === false && 'Falha na verificação do e-mail.'}
        </div>
    );
};

export default VerifyEmail;
