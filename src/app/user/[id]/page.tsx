'use client';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import Image from 'next/image';
import Link from 'next/link';

const UserPage: NextPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Carregando...</p>;
  }

  if (!session) {
    router.replace('/auth/signin');
    return null;
  }

  return (
    <div className='bg-primaryLight text-fontColor w-[600px] mt-4 p-8 rounded-lg mx-auto'>
      <div className='container mx-auto py-4 '>
        <h1 className='text-3xl font-bold mb-4 text-fontColor '>
          Perfil do Usuário
        </h1>
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt='Imagem do usuário'
            width={60}
            height={60}
            className='rounded-full mb-4'
          />
        )}
        <p>
          Olá,{' '}
          <span className='text-primaryDark bg-primary font-medium p-2 rounded-md'>
            {' '}
            {session.user?.name}
          </span>
        </p>{' '}
        <div className='flex flex-col gap-4 w-[450px] bg-primary rounded-md'></div>
        <div className='mt-8'>
          <h2 className='text-2xl font-semibold mb-2'></h2>
          <div className='flex justify-between items-center'>
            <Link href='/'>
              <div className='bg-secondary text-primaryLight py-2 px-4 rounded transition duration-300 hover:scale-110'></div>
            </Link>
            <Link
              href='/cart'
              className='px-4 py-2 mt-2 rounded bg-secondary text-primaryLight transition duration-300 hover:scale-110'
            >
              <div className=''>Finalizar</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
