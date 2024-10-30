'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { PlaceholdersAndVanishInput } from './ui/placeholders-and-vanish-input';
import { useLoadingStore } from '@/context/store';
import LoadingModal from './LoadingModal';

const SearchBox = () => {
    const [query, setQuery] = useState('');
    const isLoading = useLoadingStore((state) => state.isLoading);
    console.log('SearchBox isLoading', isLoading);
    const router = useRouter();
    const pathname = usePathname();

    const NEXTAUTH_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedQuery = query.trim().toLowerCase();

        if (trimmedQuery) {
            try {
                const url = `${NEXTAUTH_URL}/search?name=${encodeURIComponent(
                    trimmedQuery
                )}`;

                if (pathname === '/search') {
                    router.replace(url);
                    window.location.reload();
                } else {
                    router.push(url);
                }

                console.log('BASE_URL:', NEXTAUTH_URL);
                console.log('url:', url);

                setQuery('');
            } catch (error) {
                console.error('Erro ao fazer a pesquisa:', error);
            }
        }
    };

    return (
        <div className="flex justify-center items-center relative w-full">
            <PlaceholdersAndVanishInput
                placeholders={[
                    'Pesquisar...',
                    'Buscar produtos...',
                    'O que você procura?',
                ]}
                onChange={handleInputChange}
                onSubmit={handleSearch}
            />
            <LoadingModal
                isOpen={isLoading}
                message="Procurando os melhores fretes para você..."
            />
        </div>
    );
};

export default SearchBox;
