'use client';

import { useLoadingStore } from '@/context/store';
import { useEffect } from 'react';

const LoadingHandler = () => {
    const setLoading = useLoadingStore((state) => state.setLoading);

    useEffect(() => {
        
        setLoading(false);
    }, [setLoading]);

    return null;
};

export default LoadingHandler;
