'use client';
import { useEffect, useRef, useState } from 'react';

import Card from '@/components/Card';
import Link from 'next/link';
import Container from '@/components/Container';

import { NextPage } from 'next';
import { useSelectionStore } from '@/context/store';
import { useRouter, useSearchParams } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SuspenseWrapper from '@/components/SuspenseWrapper';
import Loader from '@/components/Loader';

interface ProductCategory {
    id: {
        value: string;
    };
    name: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    slug: string;
    FinalPrice: number;
    onSale: boolean;
    isNew: boolean;
    discount: number;
    images: string[];
    finalPrice: number;
    productCategories: ProductCategory[];
    brandName: string;
    brandLogo: string;
    height: number;
    width: number;
    length: number;
    weight: number;
    hasVariants: boolean;
}

const SearchResults: NextPage = () => {
    const [products, setProducts] = useState<Product[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    gsap.registerPlugin(useGSAP);

    const setSelectedCategory = useSelectionStore(
        (state) => state.setSelectedCategory
    );
    const setSelectedBrand = useSelectionStore(
        (state) => state.setSelectedBrand
    );
    const router = useRouter();

    const searchParams = useSearchParams();
    const nameQuery = searchParams.get('name') || '';

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

    const handleButtonClick = (slug: string) => {
        router.push(`/product/${slug}`);
    };

    const fetchProducts = async (nameQuery: string) => {
        setIsLoading(true);
        setErrorMessage(null);
        const url = `${BASE_URL}/products/search?name=${encodeURIComponent(
            nameQuery
        )}`;
        console.log('URL da requisição:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 404) {
          
            
            setErrorMessage('Produto não encontrado');
            setProducts([]);
            setIsLoading(false);
            return;
        }

       
        if (!response.ok) {
            const errorData = await response.json();
            setErrorMessage(errorData.message || 'Erro ao buscar produtos');
            setIsLoading(false);
            return;
        }

        const data = await response.json();
        console.log('data', data);

        if (data.products.length === 0) {
            setErrorMessage('Produto não encontrado');
        } else {
            const mappedProducts = data.products.map((product: any) => ({
                id: product._id.value,
                name: product.props.name,
                description: product.props.description,
                price: product.props.price,
                slug: product.props.slug.value,
                finalPrice: product.props.finalPrice,
                onSale: product.props.onSale,
                isNew: product.props.isNew,
                hasVariants: product.props.hasVariants,
                discount: product.props.discount,
                images: product.props.images,
                productCategories: product.props.productCategories.map(
                    (category: any) => ({
                        id: category.id.value,
                        name: category.name,
                    })
                ),
                brandName: product.props.brandName,
                brandLogo: product.props.brandUrl,
            }));
            setProducts(mappedProducts);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        if (nameQuery) {
            fetchProducts(nameQuery);
        }
    }, [nameQuery]);

    const containerRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            if (containerRef?.current) {
                const sections =
                    containerRef?.current.querySelectorAll('.card');
                gsap.fromTo(
                    sections,
                    { x: 500, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        stagger: 0.5,
                        duration: 2,
                        ease: 'power3.out',
                    }
                );
            }
        },
        { scope: containerRef }
    );

    return (
        <SuspenseWrapper>
            <Container>
                {isLoading ? (
                    <div className="flex items-center justify-center h-screen">
                        <Loader />
                    </div>
                ) : errorMessage ? (
                    <div className="flex items-center justify-center h-screen">
                        <h1 className="text-2xl font-bold">{errorMessage}</h1>
                    </div>
                ) : (
                    <section className="flex mt-2 gap-8">
                        <div className="container mx-auto card">
                            <h1 className="text-2xl font-bold mb-4">
                                Resultados da pesquisa para: {nameQuery}
                            </h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.slug}`}
                                        passHref
                                    >
                                        <Card
                                            id={product.id}
                                            title={product.name}
                                            categories={product.productCategories.map(
                                                (category) => ({
                                                    category: {
                                                        name: category.name,
                                                    },
                                                })
                                            )}
                                            precoAntigo={
                                                product.onSale
                                                    ? product.price
                                                    : undefined
                                            }
                                            precoNovo={
                                                product.FinalPrice ||
                                                product.price
                                            }
                                            emPromocao={product.onSale}
                                            desconto={product.discount}
                                            imageSRC={product.images[0]}
                                            eNovidade={product.isNew}
                                            brandName={product.brandName}
                                            brandLogo={product.brandLogo}
                                            slug={product.slug}
                                            hasVariants={product.hasVariants}
                                            height={product.height}
                                            width={product.width}
                                            length={product.length}
                                            weight={product.weight}
                                            onButtonClick={() =>
                                                handleButtonClick(product.slug)
                                            }
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </Container>
        </SuspenseWrapper>
    );
};

export default SearchResults;
