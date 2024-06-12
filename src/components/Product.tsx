"use client";
import Image from "next/image";
import Button from "./Button";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { useRef, useEffect, useState } from "react";
import { register } from "swiper/element/bundle";

register();

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/virtual";

import "swiper/css/pagination";

import SimilarProducts from "./SimilarProducts";
import { useCartStore, useFavoritesStore } from "@/context/store";
import { formatPrice } from "@/utils/formatPrice";
import Link from "next/link";

interface ProductCart {
  id: string;
  title: string;
  quantity: number;
  image: string;
  price: number;
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
interface ProductDetails {
  name?: string;
  description?: string;
  finalPrice?: number;
  images?: string[];
  slug?: string;
  stock?: number;
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
  material?: string;
  categories: Category[];
  fabricante: string;
  colors?: Color[];
  sizes?: Size[];
  stock: number;
  similarProducts: SimilarProduct[];
  variants: ProductVariant[];
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
}) => {
  const swiperElRef = useRef(null);

  const [mainImage, setMainImage] = useState(images[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const [availableStock, setAvailableStock] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  console.log("similarProducts", similarProducts);

  const checkStockAndSetVariant = (
    sizeId: string | null,
    colorId: string | null
  ) => {
    console.log("Checking stock for size:", sizeId, "and color:", colorId);
    console.log("Available variants:", variants);

    if (sizeId && colorId) {
      const selectedVariant = variants.find(
        (variant) => variant.sizeId === sizeId && variant.colorId === colorId
      );

      console.log("Selected Variant:", selectedVariant);

      if (selectedVariant) {
        setAvailableStock(selectedVariant.stock);
        setSelectedVariantId(selectedVariant.id);

        console.log("selectedVariant dentro do if", selectedVariant);
        console.log("selectedVariant stock", selectedVariant.stock);
      } else {
        setAvailableStock(0);
        setSelectedVariantId(null);
        setQuantity(1);
      }
    } else {
      setAvailableStock(0);
      setSelectedVariantId(null);
      setQuantity(1);
    }
  };

  const handleSizeChange = (sizeId: string) => {
    console.log("Selected size ID:", sizeId);
    setSelectedSize(sizeId);
    checkStockAndSetVariant(sizeId, selectedColor);
  };

  const handleColorChange = (colorId: string) => {
    console.log("Selected color ID:", colorId);
    setSelectedColor(colorId);
    checkStockAndSetVariant(selectedSize, colorId);
  };

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => {
      if (prevQuantity < availableStock) {
        setErrorMessage(null);
        return prevQuantity + 1;
      } else {
        setErrorMessage(
          "Você atingiu a quantidade máxima disponível para este produto."
        );
        return prevQuantity;
      }
    });
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };
  const cartItems = useCartStore((state: any) => state.cartItems);
  const addToCart = useCartStore((state: any) => state.addToCart);

  useEffect(() => {
    if (swiperElRef.current) {
      (swiperElRef.current as HTMLElement).addEventListener(
        "swiperprogress",
        (e) => {
          const [swiper, progress] = (e as CustomEvent).detail;
          console.log(progress);
        }
      );

      (swiperElRef.current as HTMLElement).addEventListener(
        "swiperslidechange",
        (e) => {
          console.log("slide changed");
        }
      );
    }
  }, []);

  const getColorStock = (colorId: string) => {
    const variant = variants.find((variant) => variant.colorId === colorId);
    return variant ? variant.stock : 0;
  };

  const handleAddToCart = () => {
    if (selectedVariantId) {
      if (quantity <= availableStock) {
        const selectedVariant = variants.find(
          (variant) => variant.id === selectedVariantId
        );
        if (selectedVariant) {
          addToCart({
            id: selectedVariant.id,
            quantity,
            title,
            image: mainImage,
            price: selectedVariant.price,
          });
        } else {
          alert("Please select a valid size and color combination.");
        }
      } else {
        alert("The quantity exceeds the available stock.");
      }
    } else {
      alert("Please select a valid size and color combination.");
    }
  };

  const favorites = useFavoritesStore((state: any) => state.favorites);
  const toggleFavorite = useFavoritesStore(
    (state: any) => state.toggleFavorite
  );

  const addToFavorite = useFavoritesStore((state: any) => state.addToFavorite);
  const removeFromFavorite = useFavoritesStore(
    (state: any) => state.removeFromFavorite
  );

  const isFavorited = favorites.includes(id);

  const handleToggleFavorite = () => {
    if (isFavorited) {
      removeFromFavorite(id);
    } else {
      addToFavorite({
        id,
        title,
        quantity,
        image: mainImage,
        price,
      });
    }
    toggleFavorite(id);
  };
  return (
    <section>
      <div className="flex flex-col ml-2">
        <div className="w-full border-b-2 border-primary ">
          <h2 className="text-2xl font-bold mb-2 w-full text-primaryDark border-x-primary">
            {title}
          </h2>
        </div>

        <div className="flex flex-col md:flex-row mt-4">
          <div className="flex flex-col">
            <div className="flex flex-wrap md:flex-nowrap flex-col h-10">
              <Image
                src={mainImage}
                alt="Main Product Image"
                className="mb-4 border rounded-lg"
                width={350}
                height={350}
              />

              <div className="swiper-container md:w-1/2">
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
                        alt={`Product Image ${index + 2}`}
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
          <div className="flex flex-col gap-2 p-2 ">
            <div className="flex w-96">
              <p className=" border-r-4 border-secondary shadow-2xl p-4 rounded-md">
                {description}
              </p>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleToggleFavorite}
                className="flex items-center gap-2 text-base text-primaryDark font-semibold"
                aria-label={
                  isFavorited
                    ? " Remover dos favoritos"
                    : " Adicionar aos favoritos"
                }
              >
                {isFavorited ? (
                  <FaHeart size={20} color="red" />
                ) : (
                  <FaRegHeart size={20} />
                )}
                <span className="text-xs ">
                  {isFavorited
                    ? "Remover dos Favoritos"
                    : "Adicionar aos Favoritos"}
                </span>
              </button>
            </div>
            <div className="mt-4 rounded px-2 py-2 max-w-48">
              <h3 className="text-base text-primaryDark font-semibold">
                Cores
              </h3>
              <div className="flex gap-2 mt-2">
                {colors?.map((color, index) => (
                  <button
                    key={index}
                    className={`w-4 h-4 rounded-full border border-transparent ${
                      selectedColor === color.id
                        ? "ring-2 ring-offset-2 shadow-lg ring-secondary"
                        : ""
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => handleColorChange(color.id)}
                  ></button>
                ))}
              </div>
            </div>

            <div className="mt-2 flex-initial rounded px-2 py-2 max-w-64">
              <h3 className="text-base font-semibold text-primaryDark">
                Tamanhos
              </h3>
              <div className="flex gap-2 justify-start p-2 w-60 cursor-pointer">
                {sizes?.map((size, index) => (
                  <div
                    key={index}
                    className={`border rounded p-2 ${
                      selectedSize === size.id
                        ? "bg-primary text-white"
                        : "border-light"
                    }`}
                    onClick={() => handleSizeChange(size.id)}
                  >
                    {size.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="my-4 px-4 py-2 border-r-4 border-secondary shadow-lg rounded-md bg-primaryLight w-auto">
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
                    className="w-8 h-8 flex justify-center items-center text-primaryDark font-semibold border-r-2"
                    onClick={decrementQuantity}
                  >
                    -
                  </button>
                  <button
                    className="w-8 h-8 flex justify-center items-center text-primaryDark font-semibold  border-primaryDark"
                    onClick={incrementQuantity}
                  >
                    +
                  </button>
                </div>
              </div>

              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
            </div>
            <div className="flex w-96 mt-4">
              {availableStock > 0 ? (
                <Button
                  variant="secondary"
                  size="large"
                  onClick={handleAddToCart}
                >
                  Comprar
                </Button>
              ) : (
                <p className="out-of-stock">Produto fora de estoque</p>
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
          <h2 className="text-lg text-primaryDark shadow-lg font-semibold border-r-4 border-secondary rounded p-4 whitespace-nowrap">
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
