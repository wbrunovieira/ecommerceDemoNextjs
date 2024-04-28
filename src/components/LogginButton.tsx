'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FaUserAlt } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

const LogginButton = () => {
  console.log('LogginButton');
  const { data: session, status } = useSession();
  console.log('session', session);
  console.log('status', status);

  if (status === 'loading') {
    return <div className='text-xs'>...</div>;
  }

  if (session && session.user) {
    const userName = session.user?.name;
    let id = session.user?.id;
    console.log('userName', userName);
    console.log('session && session.user', session, session.user);
    return (
      <div className='flex flex-col items-center '>
        <Link href={`/user/${session.user.id}`} passHref>
          <div className=' flex text-secondary transition duration-300 hover:scale-110 text-xs font-semibold border p-2 rounded-md bg-primaryLight items-center'>
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt='Imagem do usuário'
                width={12}
                height={12}
                className='w-6 h-6 rounded-full items-center mr-2 border border-secondary'
              />
            ) : (
              <FaUserAlt className='w-6 h-6 text-gray-400' />
            )}
            Olá, {userName}
          </div>
        </Link>
        <button
          className='hover:scale-110 text-xs mt-1 mb-2 bg-primaryLight p-1 rounded-md'
          onClick={() => signOut()}
        >
          Sair
        </button>
      </div>
    );
  } else {
    return (
      <button
        className='flex text-secondary transition duration-300 hover:scale-110 text-xs font-semibold border px-4 py-2 h-6 rounded-md bg-primaryLight items-center mt-4'
        onClick={() => signIn()}
      >
        login
      </button>
    );
  }
};

export default LogginButton;
