'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import LoadingSpinner from './LoadingSpinner';

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
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const handleButtonClick = (
        e: React.MouseEvent<HTMLButtonElement>,
        slug: string
    ) => {
        const button = e.currentTarget;

        button.classList.add('loading');
        button.setAttribute('disabled', 'true');
        console.log('Navigating to product:', slug);
        router.push(`/product/${slug}`);
        button.classList.remove('loading');
        button.removeAttribute('disabled');
    };

    const getSlug = (slug: any): string => {
        if (typeof slug === 'object' && slug !== null && 'value' in slug) {
            console.log('Slug is an object with value:', slug.value);
            return slug.value;
        }

        if (typeof slug === 'string') {
            console.log('Slug is a string:', slug);
            return slug;
        }

        console.error('Slug is in an unexpected format:', slug);
        return '';
    };

    useEffect(() => {
        const fetchProdutos = async () => {
            setLoading(true);
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
            } finally {
                setLoading(false);
            }
        };

        fetchProdutos();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="10" color="border-primary" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {produtos.map((produto) => {
                const slug = getSlug(produto.slug);
                const productLink = `/product/${slug}`;
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
                                onButtonClick={(e) =>
                                    handleButtonClick(e, produto.slug)
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
