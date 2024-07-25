'use client';
import React, { useEffect, useState } from 'react';

import Card from './Card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getProductsFeatures } from '@/api/products';

interface ProductCategory {
    category: {
        name: string;
    };
}

interface Produto {
    id: string;
    name: string;
    description: string;
    productCategories: ProductCategory[];
    price: number;
    hasVariants: boolean;
    slug: string;
    FinalPrice: number;
    onSale: boolean;
    isNew: boolean;
    discount: number;
    images: string[];
    finalPrice: number;
    height: number;
    width: number;
    length: number;
    weight: number;
    brand: {
        name: string;
        imageUrl: string;
    };
}

const ProductList = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const router = useRouter();
    const handleButtonClick = (slug: string) => {
        router.push(`/product/${slug}`);
    };

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                console.log('BASE_URL ', BASE_URL);
                const response = await getProductsFeatures();
                console.log('response do products list', response);

                const data = response;
                if (data) {
                    console.log('response ', data);
                    setProdutos(data);
                } else {
                    console.error('Estrutura da resposta inesperada:', data);
                }
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        };

        fetchProdutos();
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {produtos.map((produto) => (
                <Link
                    className="rounded "
                    key={produto.id}
                    href={`/product/${produto.slug}`}
                    passHref
                >
                    <Card
                        id={produto.id}
                        title={produto.name}
                        hasVariants={produto.hasVariants}
                        categories={produto.productCategories}
                        precoAntigo={produto.onSale ? produto.price : undefined}
                        precoNovo={produto.FinalPrice || produto.price}
                        emPromocao={produto.onSale}
                        desconto={produto.discount}
                        imageSRC={produto.images[0]}
                        eNovidade={produto.isNew}
                        brandName={produto.brand.name}
                        brandLogo={produto.brand.imageUrl}
                        slug={produto.slug}
                        height={produto.height}
                        width={produto.width}
                        length={produto.length}
                        weight={produto.weight}
                        onButtonClick={() => handleButtonClick(produto.slug)}
                    />
                </Link>
            ))}
        </div>
    );
};

export default ProductList;
