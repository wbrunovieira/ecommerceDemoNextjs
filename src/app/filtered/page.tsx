'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import { CardS, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Container from '@/components/Container';
import Sidebar from '@/components/SideBar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { useColorStore, useSelectionStore } from '@/context/store';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SuspenseWrapper from '@/components/SuspenseWrapper';
import fetchProducts from '@/utils/fetchProducts';
import Loader from '@/components/Loader';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    slug: string;
    finalPrice: number;
    productCategories: ProductCategory[];
    productColors: ProductColor[];
    productSizes: ProductSize[];
    onSale: boolean;
    isNew: boolean;
    discount: number;
    images: string[];
    brandId: string;
    brandName: string;
    brandUrl: string;
    height: number;
    width: number;
    length: number;
    weight: number;
    hasVariants: boolean;
}

interface ProductCategory {
    category: { id: { value: string }; name: string };
}
interface ProductColor {
    color: { id: { value: string }; name: string };
}
interface ProductSize {
    id: { value: string };
    name: string;
}

const FilteredResults = () => {
    const router = useRouter();
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

    const [products, setProducts] = useState<Product[]>([]);
    const [filterName, setFilterName] = useState('');
    const [sortType, setSortType] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLElement>(null);

    const selectedCategory = useSelectionStore(
        (state) => state.selectedCategory
    );
    const selectedColor = useColorStore((state) => state.selectedColor);
    const selectedBrand = useSelectionStore((state) => state.selectedBrand);
    const selectedSize = useSelectionStore((state) => state.selectedSize);
    const selectedMinPrice = useSelectionStore(
        (state) => state.selectedMinPrice
    );
    const selectedMaxPrice = useSelectionStore(
        (state) => state.selectedMaxPrice
    );

    const setSelectedCategory = useSelectionStore(
        (state) => state.setSelectedCategory
    );
    const setSelectedBrand = useSelectionStore(
        (state) => state.setSelectedBrand
    );
    const setSelectedSize = useSelectionStore((state) => state.setSelectedSize);
    const setSelectedColor = useColorStore((state) => state.setSelectedColor);
    const setSelectedMinPrice = useSelectionStore(
        (state) => state.setSelectedMinPrice
    );
    const setSelectedMaxPrice = useSelectionStore(
        (state) => state.setSelectedMaxPrice
    );

    gsap.registerPlugin(useGSAP);

    const sortProducts = (products: Product[], type: string) => {
        switch (type) {
            case 'alphabetical':
                return [...products].sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
            case 'priceAsc':
                return [...products].sort(
                    (a, b) => a.finalPrice - b.finalPrice
                );
            case 'priceDesc':
                return [...products].sort(
                    (a, b) => b.finalPrice - a.finalPrice
                );
            default:
                return products;
        }
    };

    const handleButtonClick = (slug: string) => {
        router.push(`/product/${slug}`);
    };

    useEffect(() => {
        const fetchAndSetProducts = async (url: string) => {
            try {
                setIsLoading(true);
                const products = await fetchProducts(url);
                setProducts(products);

                // Define o filtro usado, se houver
                setFilterName(
                    selectedCategory
                        ? products[0]?.productCategories[0]?.category.name
                        : selectedBrand
                        ? products[0]?.brandName
                        : selectedColor
                        ? products[0]?.productColors[0]?.color.name
                        : ''
                );
            } finally {
                setIsLoading(false); // garante que o loader será removido
            }
        };

        // Configura a URL com base nos parâmetros de busca
        const searchParams = new URLSearchParams(window.location.search);
        const category = searchParams.get('category');
        const brand = searchParams.get('brand');
        const color = searchParams.get('color');
        const size = searchParams.get('size');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');

        if (category) {
            fetchAndSetProducts(
                `${BASE_URL}/products/category/${encodeURIComponent(category)}`
            );
            setSelectedCategory(category);
        } else if (brand) {
            fetchAndSetProducts(
                `${BASE_URL}/products/brand/${encodeURIComponent(brand)}`
            );
            setSelectedBrand(brand);
        } else if (color) {
            fetchAndSetProducts(
                `${BASE_URL}/products/color/${encodeURIComponent(color)}`
            );
            setSelectedColor({ id: color, name: color, hex: color });
        } else if (size) {
            fetchAndSetProducts(
                `${BASE_URL}/products/size/${encodeURIComponent(size)}`
            );
            setSelectedSize({ id: size, name: size });
        } else if (minPrice && maxPrice) {
            fetchAndSetProducts(
                `${BASE_URL}/products/price-range?minPrice=${encodeURIComponent(
                    minPrice
                )}&maxPrice=${encodeURIComponent(maxPrice)}`
            );
            setSelectedMinPrice(Number(minPrice));
            setSelectedMaxPrice(Number(maxPrice));
        } else {
            setIsLoading(false); // Caso nenhum filtro seja aplicado, define isLoading como false
        }
    }, [
        BASE_URL,
        setSelectedCategory,
        setSelectedBrand,
        setSelectedColor,
        setSelectedSize,
        setSelectedMinPrice,
        setSelectedMaxPrice,
    ]);

    useGSAP(
        () => {
            if (!isLoading && products.length > 0) {
                const sections =
                    containerRef.current?.querySelectorAll('.card');
                if (sections && sections.length > 0) {
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
            }
        },
        { scope: containerRef, dependencies: [products] }
    );

    return (
        <SuspenseWrapper>
            <Container>
                <section
                    className="flex mt-2"
                    ref={containerRef as React.RefObject<HTMLDivElement>}
                >
                    <div className="flex flex-col">
                        <Sidebar />
                    </div>

                    <div className="container mx-auto card">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-screen">
                                <Loader />
                            </div>
                        ) : products.length > 0 ? (
                            <div>
                                <h1 className="text-2xl font-bold mb-4">
                                    {filterName && (
                                        <CardS className="text-primaryDark">
                                            <CardHeader>
                                                <CardTitle>
                                                    Produtos filtrados por:
                                                    <span className="text-secondary mt-2">
                                                        &quot;{filterName}&quot;
                                                    </span>
                                                </CardTitle>
                                            </CardHeader>
                                        </CardS>
                                    )}
                                </h1>

                                <Select
                                    value={sortType}
                                    onValueChange={setSortType}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Ordenar por" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="alphabetical">
                                            Ordem Alfabética
                                        </SelectItem>
                                        <SelectItem value="priceAsc">
                                            Menor Preço
                                        </SelectItem>
                                        <SelectItem value="priceDesc">
                                            Maior Preço
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
                                    {sortProducts(products, sortType).map(
                                        (product) => (
                                            <Link
                                                key={product.id}
                                                className="card"
                                                href={`/product/${product.slug}`}
                                                passHref
                                            >
                                                <Card
                                                    id={product.id}
                                                    title={product.name}
                                                    categories={
                                                        product.productCategories
                                                    }
                                                    precoAntigo={
                                                        product.onSale
                                                            ? product.price
                                                            : undefined
                                                    }
                                                    precoNovo={
                                                        product.finalPrice ||
                                                        product.price
                                                    }
                                                    emPromocao={product.onSale}
                                                    desconto={product.discount}
                                                    imageSRC={product.images[0]}
                                                    eNovidade={product.isNew}
                                                    brandName={
                                                        product.brandName
                                                    }
                                                    brandLogo={product.brandUrl}
                                                    hasVariants={
                                                        product.hasVariants
                                                    }
                                                    slug={product.slug}
                                                    height={product.height}
                                                    width={product.width}
                                                    length={product.length}
                                                    weight={product.weight}
                                                    onButtonClick={() =>
                                                        handleButtonClick(
                                                            product.slug
                                                        )
                                                    }
                                                />
                                            </Link>
                                        )
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-lg text-center mt-4">
                                Não há produtos disponíveis com os filtros
                                selecionados.
                            </p>
                        )}
                    </div>
                </section>
            </Container>
        </SuspenseWrapper>
    );
};

export default FilteredResults;
