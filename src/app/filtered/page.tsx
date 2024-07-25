'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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

import { NextPage } from 'next';
import { useColorStore, useSelectionStore } from '@/context/store';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface ProductCategory {
    category: {
        id: {
            value: string;
        };
        name: string;
    };
}
interface ProductColor {
    color: {
        id: {
            value: string;
        };
        name: string;
    };
}
interface ProductSize {
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
    productCategories: ProductCategory[];
    productColors: ProductColor[];
    productSizes: ProductSize[];
    onSale: boolean;
    isNew: boolean;
    discount: number;
    images: string[];
    finalPrice: number;
    materialId: string;
    brandId: string;
    brandName: string;
    brandUrl: string;
    height: number;
    width: number;
    length: number;
    weight: number;
    hasVariants: boolean;
}

const FilteredResults: NextPage = () => {
    const searchParams = useSearchParams();

    const category = searchParams.get('category');
    const brand = searchParams.get('brand');

    const color = searchParams.get('color');
    const size = searchParams.get('size');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const [products, setProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [initialLoad, setInitialLoad] = useState(true);
    const [filterName, setFilterName] = useState('');

    const router = useRouter();

    const [sortType, setSortType] = useState<string>('');

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

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

    gsap.registerPlugin(useGSAP);

    const handleButtonClick = (slug: string) => {
        router.push(`/product/${slug}`);
    };

    const fetchProducts = async (url: string) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            const mappedProducts = data.map((product: any) => ({
                id: product._id?.value,
                name: product.props.name,
                description: product.props.description,
                price: product.props.price,
                slug: product.props.slug.value,
                hasVariants: product.props.hasVariants,
                finalPrice: product.props.finalPrice,
                onSale: product.props.onSale,
                isNew: product.props.isNew,
                discount: product.props.discount,
                images: product.props.images,
                productCategories: product.props.productCategories.map(
                    (category: any) => ({
                        category: { id: category.id, name: category.name },
                    })
                ),
                productColors: product.props.productColors.map(
                    (color: any) => ({
                        color: { id: color.id, name: color.name },
                    })
                ),
                productSizes: product.props.productSizes.map((size: any) => ({
                    id: size.id,
                    name: size.name,
                })),
                brandId: product.props.brandId.value,

                brandName: product.props.brandName,
                brandUrl: product.props.brandUrl,
            }));

            setAllProducts(mappedProducts);
            setProducts(mappedProducts);
            setInitialLoad(false);
            setFilterName(getFilterName(mappedProducts));
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const getFilterName = (products: Product[]) => {
        if (category) {
            const selectedCategoryObj = products.flatMap((product) =>
                product.productCategories.filter(
                    (cat) => cat.category.id.value === category
                )
            )[0];
            return selectedCategoryObj
                ? selectedCategoryObj.category.name
                : category;
        } else if (brand) {
            const selectedBrandObj = products.find(
                (product) => product.brandId === brand
            );
            return selectedBrandObj ? selectedBrandObj.brandName : brand;
        } else if (color) {
            const selectedColorObj = products.flatMap((product) =>
                product.productColors.filter(
                    (col) => col.color.id.value === color
                )
            )[0];
            return selectedColorObj ? selectedColorObj.color.name : color;
        }
        return '';
    };

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

    useEffect(() => {
        if (!initialLoad) {
            const filterProducts = () => {
                let filteredProducts = allProducts;

                if (selectedCategory) {
                    filteredProducts = filteredProducts.filter((product) =>
                        product.productCategories.some((cat) => {
                            return cat.category.id.value === selectedCategory;
                        })
                    );
                }

                if (selectedBrand) {
                    filteredProducts = filteredProducts.filter(
                        (product) => product.brandId === selectedBrand
                    );
                }

                if (selectedColor) {
                    filteredProducts = filteredProducts.filter((product) =>
                        product.productColors.some((cat) => {
                            return cat.color.id.value === selectedColor.id;
                        })
                    );
                }

                if (selectedSize) {
                    filteredProducts = filteredProducts.filter((product) =>
                        product.productSizes.some(
                            (siz) => siz.id.value === selectedSize.id
                        )
                    );
                }

                if (selectedMinPrice !== null && selectedMaxPrice !== null) {
                    filteredProducts = filteredProducts.filter(
                        (product) =>
                            product.finalPrice >= selectedMinPrice &&
                            product.finalPrice <= selectedMaxPrice
                    );
                }

                // Apply sorting
                filteredProducts = sortProducts(filteredProducts, sortType);

                setProducts(filteredProducts);
            };

            filterProducts();
        }
    }, [
        selectedCategory,
        selectedBrand,
        selectedColor,
        selectedSize,
        allProducts,
        initialLoad,
        selectedMinPrice,
        selectedMaxPrice,
        sortType,
    ]);
    useEffect(() => {
        if (category) {
            fetchProducts(
                `${BASE_URL}/products/category/${encodeURIComponent(
                    category
                )}`
            );

            setSelectedCategory(category);
        } else if (brand) {
            fetchProducts(
                `${BASE_URL}/products/brand/${encodeURIComponent(
                    brand
                )}`
            );
            setSelectedBrand(brand);
        } else if (size) {
            fetchProducts(
                `${BASE_URL}/products/size/${encodeURIComponent(
                    size
                )}`
            );
            setSelectedSize({ id: size, name: size });
        } else if (minPrice && maxPrice) {
            fetchProducts(
                `${BASE_URL}/products/price-range?minPrice=${encodeURIComponent(
                    minPrice
                )}&maxPrice=${encodeURIComponent(maxPrice)}`
            );
            setSelectedMinPrice(Number(minPrice));
            setSelectedMaxPrice(Number(maxPrice));
        }
    }, [category, brand, size, minPrice, maxPrice]);

    useEffect(() => {
        if (color) {
            fetchProducts(
                `${BASE_URL}/products/color/${encodeURIComponent(
                    color
                )}`
            );
            setSelectedColor({ id: color, name: color, hex: color });
        }
    }, [color]);

    useEffect(() => {
        if (!initialLoad) {
            const filterProducts = () => {
                let filteredProducts = allProducts;

                if (selectedCategory) {
                    filteredProducts = filteredProducts.filter((product) =>
                        product.productCategories.some((cat) => {
                            return cat.category.id.value === selectedCategory;
                        })
                    );
                }

                if (selectedBrand) {
                    filteredProducts = filteredProducts.filter(
                        (product) => product.brandId === selectedBrand
                    );
                }

                if (selectedColor) {
                    filteredProducts = filteredProducts.filter((product) =>
                        product.productColors.some((cat) => {
                            return cat.color.id.value === selectedColor.id;
                        })
                    );
                }

                if (selectedSize) {
                    filteredProducts = filteredProducts.filter((product) =>
                        product.productSizes.some(
                            (siz) => siz.id.value === selectedSize.id
                        )
                    );
                }

                if (selectedMinPrice !== null && selectedMaxPrice !== null) {
                    filteredProducts = filteredProducts.filter(
                        (product) =>
                            product.finalPrice >= selectedMinPrice &&
                            product.finalPrice <= selectedMaxPrice
                    );
                }

                setProducts(filteredProducts);
            };

            filterProducts();
        }
    }, [
        selectedCategory,
        selectedBrand,
        selectedColor,
        selectedSize,

        allProducts,
        initialLoad,
        selectedMinPrice,
        selectedMaxPrice,
    ]);

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
        <Container>
            <section
                className="flex mt-2 gap-8"
                ref={containerRef as React.RefObject<HTMLDivElement>}
            >
                <div className="flex flex-col">
                    <Sidebar initialCategories={[]} />
                </div>
                <div className="flex flex-col "></div>
                <div className="container mx-auto card">
                    <h1 className="text-2xl font-bold mb-4">
                        {filterName && (
                            <CardS className="text-primaryDark">
                                <CardHeader>
                                    <CardTitle>
                                        {' '}
                                        Produtos filtrados por :{' '}
                                        <span className="text-secondary">
                                            "{filterName}"
                                        </span>{' '}
                                    </CardTitle>
                                </CardHeader>
                            </CardS>
                        )}
                    </h1>
                    <div>
                        <Select value={sortType} onValueChange={setSortType}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Ordenar por" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="alphabetical">
                                    Ordem Alfabética
                                </SelectItem>
                                <SelectItem value="dark">
                                    Menor Preço
                                </SelectItem>
                                <SelectItem value="priceDesc">
                                    Maior Preço
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
                                {products.map((product) => (
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
                                            brandName={product.brandName}
                                            brandLogo={product.brandUrl}
                                            hasVariants={product.hasVariants}
                                            slug={product.slug}
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
                        ) : (
                            <p className="text-lg text-center mt-4">
                                Não há produtos disponíveis com os filtros
                                selecionados.
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </Container>
    );
};

export default FilteredResults;
