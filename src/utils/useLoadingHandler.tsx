'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCartStore, useLoadingStore } from '@/context/store';

const useLoadingHandler = () => {
    const router = useRouter();
    const setLoading = useLoadingStore((state) => state.setLoading);

    useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleComplete = () => setLoading(false);

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        // Limpeza dos eventos
        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router.events, setLoading]);
};

export default useLoadingHandler;
