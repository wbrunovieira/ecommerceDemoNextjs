'use client';
import Loader from '@/components/Loader';
import dynamic from 'next/dynamic';

const WhoWeAre = dynamic(() => import('./WhoWeAreContent'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-screen">
            <Loader />
        </div>
    ),
});

export default WhoWeAre;
