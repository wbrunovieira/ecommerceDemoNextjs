'use client';
import Loader from '@/components/Loader';
import dynamic from 'next/dynamic';

const ClientSearchResults = dynamic(() => import('./ClientSearchResults'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-screen">
            <Loader />
        </div>
    ),
});

export default function SearchResultsPage() {
    return <ClientSearchResults />;
}
