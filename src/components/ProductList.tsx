'use client';
import React, { useEffect, useState } from 'react';

import Card from './Card';
import Link from 'next/link';

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
    brand: {
        name: string;
        imageUrl: string;
    };
}

const ProductList = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await fetch(
                    'http://localhost:3333/products/featured-products'
                );
                const data = await response.json();
                console.log('first', data.products[0]);
                setProdutos(data.products);
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
                    />
                </Link>
            ))}
        </div>
    );
};

export default ProductList;
