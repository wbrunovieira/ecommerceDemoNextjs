'use client';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useFavoritesStore } from '@/context/store';
import { BsTrash, BsPlus, BsDash } from 'react-icons/bs';

interface Product {
  id: string;
  quantity: number;
  title: string;
  image: string;
  price: number;
}

const UserPage: NextPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const favorited = useFavoritesStore((state: any) => state.favorites);
  const cartFavorited = useFavoritesStore((state: any) => state.cartFavorited);
  const removeFromFavorite = useFavoritesStore(
    (state: any) => state.removeFromFavorite
  );

  if (status === 'loading') {
    return <p>Carregando...</p>;
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }
  console.log('favoritos', cartFavorited);
  return (
    <div className='container max-w-4xl mx-auto mt-10 p-8 bg-primaryLight rounded-xl shadow-lg z-20 '>
      <h1 className='text-2xl font-bold text-center mb-6'>Perfil do Usuário</h1>

      <p>favoritos :{favorited}</p>
      <div>
        <p>favoritos no carrinho: {cartFavorited}</p>
        <div className='flex flex-col gap-4 w-[450px] bg-primary rounded-md'>
          {cartFavorited.map((item: any, index: number) => (
            <div key={index}>
              <p>ID: {item.id}</p>
              <p>Título: {item.title}</p>
              <p>Quantidade: {item.quantity}</p>
              <p>Preço: {item.price}</p>
            </div>
          ))}
        </div>
      </div>

      {session.user?.image && (
        <div className='flex justify-center mb-4'>
          <Image
            src={session.user.image}
            alt='Imagem do usuário'
            width={100}
            height={100}
            className='rounded-full'
          />
        </div>
      )}

      <div className='text-lg text-primaryDark w-[450px] bg-primary p-2 rounded-md '>
        <p>
          Nome: <strong>{session.user?.name}</strong>
        </p>
        <p>
          Email: <strong>{session.user?.email}</strong>
        </p>
      </div>

      <form className='mt-6 max-w-[600px] border-2 border-secondary p-4 rounded-md'>
        <div className='space-y-4'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-primaryDark'
            >
              Nome Completo
            </label>
            <input
              id='name'
              type='text'
              defaultValue={session.user?.name || ''}
              className='mt-1 text-primaryDark  w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary'
            />
          </div>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-primaryDark'
            >
              E-mail
            </label>
            <input
              id='email'
              type='email'
              defaultValue={session.user?.email || ''}
              className='mt-1 block text-primaryDark w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary'
            />
          </div>
          <div>
            <label
              htmlFor='address'
              className='block text-sm font-medium text-primaryDark'
            >
              Endereço
            </label>
            <input
              id='address'
              autoComplete='adress'
              type='text'
              placeholder='Endereço completo'
              className='mt-1 text-primaryDark  w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark'
            />
          </div>
          <div>
            <label
              htmlFor='phone'
              className='block text-sm font-medium text-primaryDark'
            >
              Telefone
            </label>
            <input
              id='phone'
              autoComplete='phone'
              type='tel'
              placeholder='(99) 99999-9999'
              className='mt-1 text-primaryDark w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary'
            />
          </div>
        </div>

        <div className='mt-8 flex justify-end'>
          <button
            type='submit'
            className='bg-primaryDark text-primary hover:bg-primary hover:text-primaryDark font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-200'
          >
            Salvar Alterações
          </button>
        </div>
      </form>

      <div className='mt-10 flex justify-between'>
        <Link
          href='/'
          className='text-primaryLight hover:underline bg-secondary p-2 rounded transition duration-300 hover:scale-105'
        >
          Voltar para Home
        </Link>
        <Link
          href='/cart'
          className='text-primaryLight hover:underline bg-secondary p-2 rounded transition duration-300 hover:scale-105'
        >
          Ver Carrinho
        </Link>
      </div>
    </div>
  );
};

export default UserPage;
