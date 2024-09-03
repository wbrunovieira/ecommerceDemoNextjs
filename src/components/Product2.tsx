'use client';
import Image from 'next/image';
import Button from './Button';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

import { useRef, useEffect, useState } from 'react';
import { register } from 'swiper/element/bundle';


register();

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/virtual';

import 'swiper/css/pagination';

import SimilarProducts from './SimilarProducts';
import {
    useCartStore,
    useColorStore,
    useFavoritesStore,
    useSelectionStore,
} from '@/context/store';
import { formatPrice } from '@/utils/formatPrice';
import Link from 'next/link';

import { useSession } from 'next-auth/react';
import ShareButtons from './ShareButtons';

import { useToast } from '@/components/ui/use-toast';

interface ProductCart {
    id: string;
    title: string;
    quantity: number;
    image: string;
    price: number;
    color?: string;
    size?: string;
}

interface Color {
    id: string;
    name: string;
    hex: string;
}
interface Size {
    id: string;
    name: string;
}
interface Category {
    id: string;
    name: string;
}

interface ProductVariant {
    id: string;
    sizeId?: string;
    colorId?: string;
    stock: number;
    price: number;
    images: string[];
    sku: string;
}

interface Product {
    image: string;
    title: string;
    price: number;
}

interface ProductProps {
    title: string;
    images: string[];
    description: string;
    price: number;
    id: string;
    height?: number;
    width?: number;
    length?: number;
    weight?: number;
    material?: string;
    categories: Category[];
    fabricante: string;
    colors?: Color[];
    sizes?: Size[];
    stock: number;
    similarProducts: SimilarProduct[];
    variants: ProductVariant[];
    slug: string;
    hasVariants: boolean;
    productIdVariant: string;
}
interface SimilarProduct {
    id: string;
    image: string;
    title: string;
    price: number;
    slug: string;
}

const Product: React.FC<ProductProps> = ({
    id,
    title,
    images,
    description,
    price,
    material,
    categories,
    fabricante,
    colors,
    sizes,
    stock,
    variants,
    similarProducts,
    height,
    width,
    length,
    weight,
    slug,
    hasVariants,
    productIdVariant,
}) => {
    const swiperElRef = useRef(null);

    const [mainImage, setMainImage] = useState(images[0]);

    const [quantity, setQuantity] = useState(1);
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
        null
    );
    const [availableStock, setAvailableStock] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isBuyButtonDisabled, setIsBuyButtonDisabled] = useState(true);
    const [isStockChecked, setIsStockChecked] = useState<boolean>(false);
    const setSelectedColor = useColorStore((state) => state.setSelectedColor);
    const selectedColor = useColorStore((state) => state.selectedColor);
    const setSelectedSize = useSelectionStore((state) => state.setSelectedSize);
    const selectedSize = useSelectionStore((state) => state.selectedSize);

    const { data: session } = useSession();
    const setUser = useCartStore((state) => state.setUser);

    const cartItems = useCartStore((state: any) => state.cartItems);
    const addToCart = useCartStore((state: any) => state.addToCart);

    const { toast } = useToast();

    const checkStockAndSetVariant = (
        sizeId: string | null,
        colorId: string | null
    ) => {
        if (hasVariants) {
            const selectedVariant = variants.find(
                (variant) =>
                    variant.sizeId === sizeId && variant.colorId === colorId
            );

            if (selectedVariant) {
                setAvailableStock(selectedVariant.stock);
                setSelectedVariantId(selectedVariant.id);
            } else {
                setAvailableStock(0);
                setSelectedVariantId(null);
                setQuantity(1);
            }
        }

        if (!sizeId && !colorId) {
            setAvailableStock(stock);
            setSelectedVariantId(null);
            setQuantity(1);
        }
        setIsStockChecked(true);
    };

    const handleSizeChange = (size: Size) => {
        setSelectedSize(size);
        checkStockAndSetVariant(size.id, selectedColor?.id || null);
    };

    const handleColorChange = (color: Color) => {
        setSelectedColor(color);
        checkStockAndSetVariant(selectedSize?.id || null, color.id);
    };

    const incrementQuantity = () => {
        setQuantity((prevQuantity) => {
            if (prevQuantity < availableStock) {
                setErrorMessage(null);
                return prevQuantity + 1;
            } else {
                setErrorMessage(
                    'Você atingiu a quantidade máxima disponível para este produto.'
                );
                return prevQuantity;
            }
        });
    };

    const decrementQuantity = () => {
        setQuantity((prevQuantity) =>
            prevQuantity > 1 ? prevQuantity - 1 : 1
        );
    };

    const handleAddToCart = () => {
        console.log(
            'enttrou no handleAddToCart olha tudo que achou:',
            id,
            quantity,
            title,
            mainImage,
            price,
            height,
            width,
            length,
            weight,
            hasVariants,
            productIdVariant
        );
        const userId = session?.user?.id || null;

        if (hasVariants) {
            console.log(
                'handleAddToCart hasVariants ',
                hasVariants,
                productIdVariant
            );

            if (selectedVariantId) {
                if (quantity <= availableStock) {
                    const selectedVariant = variants.find(
                        (variant) => variant.id === selectedVariantId
                    );
                    if (selectedVariant) {
                        addToCart(
                            {
                                id: selectedVariant.id,
                                quantity,
                                title,
                                image: mainImage,
                                price: selectedVariant.price,
                                height,
                                width,
                                length,
                                weight,
                                color: selectedColor?.name,
                                colorId: selectedColor?.id,
                                size: selectedSize?.name,
                                sizeId: selectedSize?.id,
                                hasVariants,
                                productIdVariant,
                            },
                            userId
                        );
                        toast({
                            title: 'Item adicionado ao carrinho',
                            description:
                                'Seu item foi adicionado ao carrinho com sucesso!',
                        });
                    } else {
                        alert(
                            'Please select a valid size and color combination.'
                        );
                    }
                } else {
                    alert('The quantity exceeds the available stock.');
                }
            } else {
                alert('Please select a valid size and color combination.');
            }
        } else {
            console.log(
                'ok estamos no else que nao e variant entao tem que ta tudo aqui',
                id,
                quantity,
                title,
                mainImage,
                price,
                height,
                width,
                length,
                weight,
                hasVariants,
                productIdVariant
            );
            if (quantity <= availableStock) {
                addToCart({
                    id,
                    quantity,
                    title,
                    image: mainImage,
                    price,
                    height,
                    width,
                    length,
                    weight,
                    hasVariants,
                    productIdVariant,
                });
                toast({
                    title: 'Item adicionado ao carrinho',
                    description:
                        'Seu item foi adicionado ao carrinho com sucesso!',
                });
            } else {
                alert('The quantity exceeds the available stock.');
            }
        }
        toast({
            title: 'Item adicionado ao carrinho',
            description: 'Seu item foi adicionado ao carrinho com sucesso!',
        });
    };

    useEffect(() => {
        if (session?.user?.id) {
            setUser(session.user.id);
        }
    }, [cartItems, session, setUser]);

    useEffect(() => {
        if (!hasVariants) {
            setAvailableStock(stock);
            setIsBuyButtonDisabled(false);
        }
    }, [hasVariants, stock]);

    useEffect(() => {
        if (hasVariants && (!selectedSize || !selectedColor)) {
            setIsBuyButtonDisabled(true);
        } else {
            setIsBuyButtonDisabled(false);
        }
    }, [selectedSize, selectedColor, hasVariants]);

    useEffect(() => {
        if (swiperElRef.current) {
            (swiperElRef.current as HTMLElement).addEventListener(
                'swiperprogress',
                (e) => {
                    const [swiper, progress] = (e as CustomEvent).detail;
                }
            );

            (swiperElRef.current as HTMLElement).addEventListener(
                'swiperslidechange',
                (e) => {}
            );
        }
    }, []);

    const getColorStock = (colorId: string) => {
        const variant = variants.find((variant) => variant.colorId === colorId);
        return variant ? variant.stock : 0;
    };

    const favorites = useFavoritesStore((state: any) => state.favorites);
    const toggleFavorite = useFavoritesStore(
        (state: any) => state.toggleFavorite
    );

    const addToFavorite = useFavoritesStore(
        (state: any) => state.addToFavorite
    );
    const removeFromFavorite = useFavoritesStore(
        (state: any) => state.removeFromFavorite
    );

    const isFavorited = favorites.includes(id);

    const handleToggleFavorite = () => {
        const userId = session?.user?.id || null;
        if (isFavorited) {
            removeFromFavorite(id);
        } else {
            addToFavorite(
                {
                    id,
                    title,
                    quantity,
                    image: mainImage,
                    price,
                },
                userId
            );
        }
        toggleFavorite(id, userId);
    };

    return (
        <section>
            <div className="flex flex-col w-full md:ml-2">
                <div className="w-full border-primary ">
                    <div className="border-r-4 border-secondary shadow-2xl p-4 rounded-md text-base md:text-3xl w-1/3 md:w-1/2 text-primaryDark dark:text-primaryLight dark:bg-secondary dark:border-primaryLight">
                        {title}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row mt-4">
                    <div className="flex flex-col">
                        <div className="flex flex-col md:flex-nowrap  h-10">
                            <div>
                                <Image
                                    src={mainImage}
                                    alt="Main Product Image"
                                    className="mb-4 border rounded-lg"
                                    width={350}
                                    height={350}
                                />
                            </div>

                            <div className="swiper-container w-1/2">
                                <Swiper
                                    slidesPerView={3}
                                    navigation={true}
                                    pagination={{ clickable: true }}
                                    spaceBetween={30}
                                    centeredSlides={true}
                                    autoplay
                                    className="h-40 w-80"
                                >
                                    {images.map((image, index) => (
                                        <SwiperSlide
                                            key={index}
                                            onClick={() => setMainImage(image)}
                                            className="h-60 w-60 cursor-pointer"
                                        >
                                            <Image
                                                src={image}
                                                alt={`Product Image ${
                                                    index + 2
                                                }`}
                                                width={200}
                                                height={200}
                                                className="cursor-pointer rounded-lg hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 p-2 mt-4 md:mt-0 md:w-1/2">
                        <div className="flex w-full md:w-96">
                            <p className=" border-r-4 border-secondary shadow-2xl p-4 rounded-md dark:bg-secondary dark:border-primaryLight">
                                {description}
                            </p>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={handleToggleFavorite}
                                className="flex items-center gap-2 text-base text-primaryDark dark:text-primaryLight font-semibold"
                                aria-label={
                                    isFavorited
                                        ? ' Remover dos favoritos'
                                        : ' Adicionar aos favoritos'
                                }
                            >
                                {isFavorited ? (
                                    <FaHeart size={20} color="red" />
                                ) : (
                                    <FaRegHeart size={20} />
                                )}
                                <span className="text-xs ">
                                    {isFavorited
                                        ? 'Remover dos Favoritos'
                                        : 'Adicionar aos Favoritos'}
                                </span>
                            </button>
                        </div>
                        <div></div>
                        <div className="text-left w-full text-primaryDark dark:text-primaryLight border-x-primary mb-4">
                            <ShareButtons
                                product={{
                                    slug,
                                    title,
                                    category: categories[0]?.name || '',
                                }}
                            />
                        </div>

                        {hasVariants && (
                            <>
                                <div className="mt-2 rounded px-2 py-2 max-w-48">
                                    <h3 className="text-base text-primaryDark dark:text-primaryLight  font-semibold">
                                        Cores
                                    </h3>
                                    <div className="flex gap-2 mt-2">
                                        {colors?.map((color, index) => (
                                            <button
                                                key={index}
                                                className={`w-4 h-4 rounded-full border border-secondary ${
                                                    selectedColor?.id ===
                                                    color.id
                                                        ? 'ring-2 ring-offset-2 shadow-lg ring-secondary'
                                                        : ''
                                                }`}
                                                style={{
                                                    backgroundColor: color.hex,
                                                }}
                                                title={color.name}
                                                onClick={() =>
                                                    handleColorChange(color)
                                                }
                                            ></button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-2 flex-initial rounded px-2 py-2 max-w-64">
                                    <h3 className="text-base font-semibold text-primaryDark dark:text-primaryLight ">
                                        Tamanhos
                                    </h3>
                                    <div className="flex gap-2 justify-start p-2 w-60 cursor-pointer">
                                        {sizes?.map((size, index) => (
                                            <div
                                                key={index}
                                                className={`border rounded p-2 ${
                                                    selectedSize?.id === size.id
                                                        ? 'bg-primary text-white'
                                                        : 'border-light'
                                                }`}
                                                onClick={() =>
                                                    handleSizeChange(size)
                                                }
                                            >
                                                {size.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="my-2 px-4 py-2 border-r-4 border-secondary shadow-lg rounded-md bg-primaryLight w-auto">
                            <p className="text-primaryDark font-semibold text-lg">
                                {formatPrice(price)}
                            </p>
                        </div>

                        <div className="flex items-center p-2 max-w-md rounded-md">
                            <div className="flex items-center mr-4">
                                <span className="flex justify-center items-center w-8 h-8 bg-primaryDark text-primaryLight font-bold rounded-full border border-primaryDark">
                                    {quantity}
                                </span>

                                <div className="flex ml-2">
                                    <button
                                        className="w-8 h-8 flex justify-center items-center text-primaryDark dark:text-primaryLight font-semibold border-r-2"
                                        onClick={decrementQuantity}
                                    >
                                        -
                                    </button>
                                    <button
                                        className="w-8 h-8 flex justify-center items-center text-primaryDark dark:text-primaryLight  font-semibold  border-primaryDark"
                                        onClick={incrementQuantity}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {errorMessage && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errorMessage}
                                </p>
                            )}
                        </div>
                        <div className="flex w-96 mt-4">
                            {!hasVariants || isStockChecked ? (
                                availableStock > 0 ? (
                                    <Button
                                        variant="secondary"
                                        size="large"
                                        onClick={() => {
                                            handleAddToCart();
                                            toast({
                                                title: 'Item adicionado ao carrinho',
                                                description:
                                                    'Seu item foi adicionado ao carrinho com sucesso!',
                                            });
                                        }}
                                        disabled={isBuyButtonDisabled}
                                    >
                                        Comprar
                                    </Button>
                                ) : (
                                    <p className="out-of-stock">
                                        Produto fora de estoque
                                    </p>
                                )
                            ) : (
                                <p className="text-gray-500">
                                    Selecione cor e tamanho
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col mt-4 border border-light rounded px-8 py-2 w-96 text-xs text-[#676666] ">
                            <div className="flex gap-2 ">
                                <p className="font-semibold">SKU: </p>
                                <p>{id}</p>
                            </div>
                            <div className="flex gap-2">
                                <p className="font-semibold">Material: </p>
                                <p>{material}</p>
                            </div>

                            <div className="flex gap-2">
                                <p className="font-semibold">Categoria: </p>
                                {Array.isArray(categories) &&
                                    categories.map((category, index) => (
                                        <p key={index}>{category.name}</p>
                                    ))}
                            </div>
                            <div className="flex gap-2">
                                <p className="font-semibold">Fabricante: </p>
                                <p>{fabricante}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 w-auto border-t-2 border-primary mt-4">
                <div className="w-full flex mt-4 ">
                    <h2 className="text-lg text-primaryDark dark:text-primaryLight shadow-lg font-semibold border-r-4 border-secondary rounded p-4 whitespace-nowrap">
                        Produtos Parecidos
                    </h2>
                </div>
                <div className="flex gap-4 w-[64rem]">
                    <Swiper
                        slidesPerView={3}
                        navigation={true}
                        pagination={{ clickable: true }}
                        spaceBetween={20}
                        centeredSlides={true}
                        autoplay
                    >
                        {similarProducts.map((product, index) => (
                            <SwiperSlide key={index}>
                                <Link href={`/product/${product.slug}`}>
                                    <SimilarProducts
                                        image={product.image}
                                        title={product.title}
                                        price={product.price}
                                        slug={product.slug}
                                    />
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default Product;
