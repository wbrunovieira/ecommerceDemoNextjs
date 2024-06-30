import Image from "next/image";
import { useSession } from "next-auth/react";
import Button from "./Button";
import Link from "next/link";
import { useCartStore } from "@/context/store";

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
}

interface ProductCart {
  id: string;
  quantity: number;
  title: string;
  image: string;
  precoNovo: number;
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

  brandLogo,
}) => {
  const addToCart = useCartStore((state: any) => state.addToCart);
  const { data: session } = useSession();

  const handleAddToCart = (product: ProductCart) => {
    const userId = session?.user?.id || null;
    addToCart({
      id: product.id,
      title: product.title,
      quantity: 1,
      image: validImageSRC,
      price: product.precoNovo,
    }, userId);
  };

  const validImageSRC = imageSRC || "/images/foto1.jpg";
  const formattedCategories = categories
    .map((cat) => cat.category.name)
    .join(", ");

  return (
    <div className="max-w-sm rounded-md shadow-lg bg-primaryLight m-2 h-96 flex flex-col transform hover:scale-105 hover:shadow-lg transition duration-400 ease-in-out">
      <div className="relative overflow-hidden flex-shrink-0 rounded-md h-[200px]">
        <Image
          src={validImageSRC}
          width={400}
          height={300}
          alt={title}
          layout="responsive"
          objectFit="fill"
          objectPosition="center center"
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
        {desconto && (
          <div className="relative">
            <div className="absolute descont-badge rounded">{`${desconto}%`}</div>
          </div>
        )}
      </div>
      <div className="flex-1 px-6 py-4 flex flex-col justify-between">
        <div>
          <h3 className="font-regular text-xs text-primary">
            {formattedCategories}
          </h3>
          <h2 className="semibold text-xl mb-2 text-fontColor">{title}</h2>
          <p className="text-gray-700 text-sm font-bold text-fontColor">
            {precoAntigo && (
              <span className="line-through mr-2 font-extralight">
                R${precoAntigo.toFixed(2)}
              </span>
            )}
            <span className="text-red-500">R${precoNovo}</span>
          </p>
        </div>
        <div className="pb-2">
          <Link href="/product/ ">
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
                });
              }}
            >
              Comprar
            </Button>
          </Link>
        </div>
        {brandName && brandLogo && (
          <div className="flex items-center mt-4">
            <Image
              src={brandLogo}
              width={20}
              height={20}
              alt={brandName}
              className="mr-2"
            />
            <span className="text-xs text-gray-600">{brandName}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
