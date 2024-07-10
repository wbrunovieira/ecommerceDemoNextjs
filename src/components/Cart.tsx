"use client";
import { useCartStore } from "@/context/store";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useSession } from 'next-auth/react';

import { BsTrash, BsPlus, BsDash } from "react-icons/bs";
interface Product {
  id: string;
  quantity: number;
  title: string;
  image: string;
  price: number;
  height: number;
  width: number;
  length: number;
  weight: number;
  color?: string;
  size?: string;
}
const Cart = () => {
  const cartItems = useCartStore((state: any) => state.cartItems);

  const initializeCart = useCartStore((state: any) => state.initializeCart);
  const removeFromCart = useCartStore((state: any) => state.removeFromCart);
  const updateQuantity = useCartStore((state: any) => state.updateQuantity);

  const { data: session } = useSession();
  const setUser = useCartStore((state) => state.setUser);

  useEffect(() => {
    initializeCart(cartItems);
    if (session?.user?.id) {
      setUser(session.user.id);
    }

  }, [session, setUser]);

 
  const increaseQuantity = (id: string) => {
    updateQuantity(id, 1);
  };

  const decreaseQuantity = (id: string) => {
    updateQuantity(id, -1);
  };
  return (
    <div className="bg-primaryLight text-fontColor dark:text-primaryLight  w-[600px] mt-4 p-8 rounded-lg">
      <div className="container mx-auto py-4 ">
        <h1 className="text-3xl font-bold mb-4 text-fontColor "></h1>

        <div className="flex flex-col gap-4 w-[450px] bg-primary rounded-md">
          {cartItems.map((item: Product, index: number) => (
            <div
              key={index}
              className="bg-white p-4 rounded shadow flex gap-4 "
            >
              <Image
                className="rounded-xl"
                src="/images/liz1.webp"
                width={50}
                height={50}
                alt=""
              />

              <div className="flex flex-col justify-center items-center">
                <h2 className="text-base font-semibold text-primaryDark ">
                  QTD{" "}
                </h2>
                <div className="flex justify-center items-center">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="text-sm p-1"
                  >
                    <BsDash />
                  </button>
                  <h2 className="text-base font-light mb-2">
                    {" "}
                    {item.quantity}
                  </h2>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="text-sm p-1"
                  >
                    <BsPlus />
                  </button>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center">
                <h2 className="text-base font-semibold text-primaryDark ">
                  Produto{" "}
                </h2>
                <h2 className="text-base font-light mb-2 whitespace-nowrap">
                  {item.title}
                </h2>
                {item.color && (
                  <p className="text-xs text-gray-500">Cor: {item.color}</p>
                )}
                {item.size && (
                  <p className="text-xs text-gray-500">Tamanho: {item.size}</p>
                )}
              </div>
              <div className="flex flex-col justify-center items-center">
                <p className="text-base font-semibold text-primaryDark ">
                  Preço{" "}
                </p>
                <p className="text-base font-light mb-2 whitespace-nowrap">
                  {item.price !== undefined ? item.price.toFixed(2) : "0.00"}
                </p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <p className="text-base font-semibold text-primaryDark ">
                  Total{" "}
                </p>
                <p className="text-base font-light mb-2 whitespace-nowrap">
                  {item.price !== undefined ? item.price.toFixed(2) : "0.00"}
                </p>
              </div>
              <div className="flex flex-col justify-center items-center ml-4">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-secondary text-white-important py-2 text-xs px-4 rounded transition duration-300 hover:scale-105"
                >
                  <BsTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-2">
            Total: R${" "}
            {cartItems
              .reduce(
                (acc: number, item: Product) =>
                  acc +
                  (item.price !== undefined ? item.price * item.quantity : 0),
                0
              )
              .toFixed(2)}
          </h2>
          <div className="flex justify-between items-center">
            <Link href="/">
              <div className="bg-secondary text-primaryLight py-2 px-4 rounded transition duration-300 hover:scale-110">
                Adcionar mais produtos
              </div>
            </Link>
            <Link
              href="/cart"
              className="px-4 py-2 mt-2 rounded bg-secondary text-primaryLight transition duration-300 hover:scale-110"
            >
              <div className="">Finalizar</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
