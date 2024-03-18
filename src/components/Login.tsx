import Image from 'next/image';
import React from 'react';

const Login = () => {
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
          <form className='flex flex-col space-y-4'>
            <input
              type='email'
              placeholder='Email'
              className='px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-96 md:w-72 sm:w-32 '
            />
            <input
              type='password'
              placeholder='Senha'
              className='px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-96 md:w-72 sm:w-32'
            />
            <button
              type='submit'
              className='bg-secondary text-white-important px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark w-96 md:w-72 sm:w-32 transition duration-300 hover:scale-105'
            >
              Acessar
            </button>
            <button
              type='submit'
              className='bg-secondary text-white-important px-2  text-xs py-1 rounded-lg shadow-md hover:bg-secondary-dark w-96 md:w-72 sm:w-32 transition duration-300 hover:scale-105'
            >
              Cadastro
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
