'use client';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Button from './Button';
import { useRouter } from 'next/navigation';

import { useCartStore } from '@/context/store';
import { useToast } from './ui/use-toast';

interface ProductCategory {
    category: {
        name: string;
    };
}

interface CardProps {
    id: string;
    title: string;
    categories: ProductCategory[];
    precoAntigo?: number;
    precoNovo: number;
    emPromocao?: boolean;
    eNovidade?: boolean;
    desconto?: number;
    imageSRC?: string;
    brandName?: string;
    brandLogo?: string;
    hasVariants: boolean;
    slug: string;

    height: number;
    width: number;
    length: number;
    weight: number;
    onButtonClick: (slug: string) => void;
}

interface ProductCart {
    id: string;
    quantity: number;
    title: string;
    image: string;
    precoNovo: number;
    hasVariants: boolean;
    height: number;
    width: number;
    length: number;
    weight: number;
}
const Card: React.FC<CardProps> = ({
    id,
    title,
    precoAntigo,

    precoNovo,
    emPromocao = false,
    desconto,
    imageSRC,
    categories = [],
    eNovidade,
    brandName,
    hasVariants,
    brandLogo,
    slug,
    height,
    length,
    weight,
    width,
    onButtonClick,
}) => {
    const addToCart = useCartStore((state: any) => state.addToCart);
    const { data: session } = useSession();
    const router = useRouter();

    const { toast } = useToast();

    const handleAddToCart = (
        e: React.MouseEvent<HTMLButtonElement>,
        product: ProductCart
    ) => {
        const userId = session?.user?.id || null;
        const button = e.currentTarget;

        button.classList.add('loading');
        button.setAttribute('disabled', 'true');

        addToCart(
            {
                id: product.id,
                quantity: 1,
                title,
                image: validImageSRC,
                price: product.precoNovo,
                height: product.height,
                width: product.width,
                length: product.length,
                weight: product.weight,
                hasVariants: product.hasVariants,
            },
            userId
        );

        toast({
            title: 'Sucesso',
            description: 'Item adcionado no carrinho!',
        });
    };

    const validImageSRC = imageSRC || '/images/foto1.jpg';
    const formattedCategories = categories
        .map((cat) => cat?.category?.name || '')
        .join(', ');

    return (
        <div className="max-w-sm rounded-md shadow-lg bg-white border-2 border-y-primaryDark   m-2 h-96 flex flex-col transform hover:scale-105 hover:shadow-lg transition duration-400 ease-in-out">
            <div className="relative overflow-hidden  rounded-md h-[200px] w-full">
                <Image
                    src={validImageSRC}
                    alt={title}
                    width={400}
                    height={300}
                    className="object-contain object-center"
                />
                {emPromocao && (
                    <div className="absolute promocao1 transform rotate-45 translate-x-1/3 -translate-y-1/3 px-2 py-1 text-xs uppercase">
                        PROMOÇÃO
                    </div>
                )}
                {eNovidade && (
                    <div className="absolute novidade transform rotate-45 translate-x-1/3 -translate-y-1/3 px-2 py-1 text-xs uppercase">
                        Novidade
                    </div>
                )}
                {desconto && desconto > 0 && (
                    <div className="relative">
                        <div className="absolute desconto-badge rounded">{`${desconto}%`}</div>
                    </div>
                )}
            </div>
            <div className="flex-1 px-6 py-4 flex flex-col justify-between">
                <div>
                    <h3 className="font-regular text-xs text-primary">
                        {formattedCategories}
                    </h3>
                    <div className="relative group">
                        <h2 className="text-xl font-semibold mb-2 text-fontColor  truncate">
                            {title}
                        </h2>
                        <div className="absolute hidden group-hover:block bg-primaryDark text-white text-[10px] rounded-lg py-1 px-2 z-10 -top-6 left-1/2 transform -translate-x-1/2 transition-opacity duration-600 ease-in-out opacity-0 group-hover:opacity-100">
                            {title}
                        </div>
                    </div>

                    <p className="text-sm font-bold text-fontColor  ">
                        {precoAntigo && (
                            <span className="line-through mr-2 font-extralight">
                                R${precoAntigo.toFixed(2)}
                            </span>
                        )}
                        <span className="text-primaryDark  FontColor">
                            R${precoNovo.toFixed(2)}
                        </span>
                    </p>
                </div>
                <div className="pb-2 mt-2">
                    {hasVariants ? (
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={() => onButtonClick(slug)}
                        >
                            Saber mais
                        </Button>
                    ) : (
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart(e, {
                                    id,
                                    title,
                                    quantity: 1,
                                    image: validImageSRC,
                                    precoNovo,
                                    height,
                                    width,
                                    length,
                                    weight,
                                    hasVariants,
                                });
                            }}
                        >
                            <span className="loading-spinner hidden absolute inset-0 items-center justify-center loading-spinner">
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                            </span>

                            <span className="button-text">
                                {hasVariants ? 'Saber mais' : 'Comprar'}
                            </span>
                        </Button>
                    )}
                    {brandName && brandLogo && (
                        <div className="flex items-center mt-2">
                            <Image
                                src={brandLogo}
                                width={20}
                                height={20}
                                alt={brandName}
                                className="mr-2 object-contain w-5 h-5"
                            />
                            <span className="text-xs text-gray-600 ">
                                {brandName}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Card;
