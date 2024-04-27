'use client';
import { useCartStore } from '@/context/store';
import Image from 'next/image';
import { BsTrash } from 'react-icons/bs';
interface Product {
  id: string;
  qtd: number;
  title: string;
  image: string;
  price: number;
}
const Cart = () => {
  const cartItems = useCartStore((state: any) => state.cartItems);
  const addToCart = useCartStore((state: any) => state.addToCart);
  const removeFromCart = useCartStore((state: any) => state.removeFromCart);

  return (
    <div className='bg-primaryLight text-fontColor w-[600px] mt-4 p-8 rounded-lg'>
      <div className='container mx-auto py-4 '>
        <h1 className='text-3xl font-bold mb-4 text-fontColor '></h1>

        <div className='flex flex-col gap-4 w-[450px] bg-primary rounded-md'>
          {cartItems.map((item: Product, index: number) => (
            <div
              key={index}
              className='bg-white p-4 rounded shadow flex gap-4 '
            >
              <Image
                className='rounded-xl'
                src='/images/liz1.webp'
                width={50}
                height={50}
                alt=''
              />

              <div className='flex flex-col justify-center items-center'>
                <h2 className='text-base font-semibold text-primaryDark '>
                  QTD{' '}
                </h2>
                <h2 className='text-base font-light mb-2'> 1</h2>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <h2 className='text-base font-semibold text-primaryDark '>
                  Produto{' '}
                </h2>
                <h2 className='text-base font-light mb-2 whitespace-nowrap'>
                  {item.title}
                </h2>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <p className='text-base font-semibold text-primaryDark '>
                  Preço{' '}
                </p>
                <p className='text-base font-light mb-2 whitespace-nowrap'>
                  {item.price}
                </p>
              </div>
              <div className='flex flex-col justify-center items-center ml-4'>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className='bg-secondary text-white-important py-2 text-xs px-4 rounded'
                >
                  <BsTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-8'>
          <h2 className='text-2xl font-semibold mb-2'>Total: R$ 60,00</h2>
          <button className='bg-primary text-primaryDark py-2 px-4 rounded'>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
