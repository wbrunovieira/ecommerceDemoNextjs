'use client';
import { redirect } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { SyntheticEvent, useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.log(result);
      return;
    }

    router.replace('/');
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center'>
      <div className='bg-primaryLight p-96 rounded-lg shadow-lg z-10 relative overflow-hidden lg:p-96 md:p-48 sm:w-full'>
        <div className='absolute inset-0 z-0'>
          <Image
            src='/images/petalas.svg'
            layout='fill'
            objectFit='cover'
            alt='Stylos Lingerie'
            className='opacity-50'
          />
        </div>

        <div className='relative z-10 bg-primary p-16 border-2 border-y-primaryDark rounded-lg shadow-lg'>
          <h2 className='text-2xl font-bold text-secondary mb-4 '>Login</h2>
          <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
            <input
              type='email'
              name='email'
              placeholder='Email'
              value={email}
              className='px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-96 md:w-72 sm:w-32 '
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type='password'
              name='password'
              placeholder='Senha'
              value={password}
              className='px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-96 md:w-72 sm:w-32'
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type='submit'
              className='bg-secondary text-white-important px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark w-96 md:w-72 sm:w-32 transition duration-300 hover:scale-105'
            >
              Acessar
            </button>
            <button
              type='button'
              onClick={() => signIn('google')}
              className='bg-secondary text-white-important flex items-center justify-center px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark w-96 md:w-72 sm:w-32 transition duration-300 hover:scale-105'
            >
              <FcGoogle className='mr-2' size={24} />
              Login com Google
            </button>
            <Link href='/cadastro'>
              <button
                type='button'
                className='bg-secondary text-white-important px-2  text-xs py-1 rounded-lg shadow-md hover:bg-secondary-dark w-96 md:w-72 sm:w-32 transition duration-300 hover:scale-105'
              >
                Cadastro
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
