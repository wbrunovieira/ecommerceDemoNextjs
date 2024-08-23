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
    onButtonClick: () => void;
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

    const handleButtonClick = (slug: string) => {
        router.push(`/product/${slug}`);
    };

    const handleAddToCart = (product: ProductCart) => {
        const userId = session?.user?.id || null;

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
        .map((cat) => cat.category.name)
        .join(', ');

    return (
        <div className="max-w-sm rounded-md shadow-lg bg-white border-2 border-y-primaryDark  dark:bg-dark-secondary-gradient m-2 h-96 flex flex-col transform hover:scale-105 hover:shadow-lg transition duration-400 ease-in-out">
            <div className="relative overflow-hidden flex-shrink-0 rounded-md h-[200px]">
                <Image
                    src={validImageSRC}
                    width={400}
                    height={300}
                    alt={title}
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center center',
                    }}
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
                    <h2 className="semibold text-xl mb-2 text-fontColor dark:text-darkFontColor">
                        {title}
                    </h2>
                    <p className="text-gray-700 text-sm font-bold text-fontColor dark:text-dark ">
                        {precoAntigo && (
                            <span className="line-through mr-2 font-extralight">
                                R${precoAntigo.toFixed(2)}
                            </span>
                        )}
                        <span className="text-primaryDark dark:text-dark FontColor">
                            R${precoNovo.toFixed(2)}
                        </span>
                    </p>
                </div>
                <div className="pb-2 mt-2">
                    {hasVariants ? (
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={onButtonClick}
                        >
                            Saber mais
                        </Button>
                    ) : (
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart({
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
                            {hasVariants ? 'Saber mais' : 'Comprar'}
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
                            <span className="text-xs text-gray-600 dark:text-darkFontColor">
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
