'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    finalPrice: number;
    onSale: boolean;
    isNew: boolean;
    discount: number;
    images: string[];
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
        console.log('Navigating to product:', slug);
        router.push(`/product/${slug}`);
    };

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL_BACKEND}/products/featured-products`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    }
                );

                console.log('Response from API:', response.data);

                if (Array.isArray(response.data.products)) {
                    setProdutos(response.data.products);
                } else {
                    console.error(
                        'Unexpected response structure:',
                        response.data
                    );
                }
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        };

        fetchProdutos();
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {produtos.map((produto) => {
                const productLink = `/product/${produto.slug}`;
                console.log('Link generated:', productLink);
                return (
                    <Link
                        className="rounded"
                        key={produto.id}
                        href={productLink}
                        legacyBehavior
                    >
                        <a>
                            <Card
                                id={produto.id}
                                title={produto.name}
                                hasVariants={produto.hasVariants}
                                categories={produto.productCategories}
                                precoAntigo={
                                    produto.onSale ? produto.price : undefined
                                }
                                precoNovo={produto.finalPrice || produto.price}
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
                                onButtonClick={() =>
                                    handleButtonClick(produto.slug)
                                }
                            />
                        </a>
                    </Link>
                );
            })}
        </div>
    );
};

export default ProductList;
