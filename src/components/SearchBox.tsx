'use client';

import { BsSearch } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlaceholdersAndVanishInput } from './ui/placeholders-and-vanish-input';
import { useLoadingStore } from '@/context/store';
import LoadingModal from './LoadingModal';

const SearchBox = () => {
    const [query, setQuery] = useState('');
    const isLoading = useLoadingStore((state) => state.isLoading);
    console.log('SearchBox isLoading',isLoading)

    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedQuery = query.trim().toLowerCase();

        if (trimmedQuery) {
            router.push(`/search?query=${encodeURIComponent(trimmedQuery)}`);
            setQuery('');
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
