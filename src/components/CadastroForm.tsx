'use client';
import React, { useState, SyntheticEvent } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';

const CadastroForm = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      name,
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
          <h2 className='text-2xl font-bold text-secondary mb-4'>Cadastro</h2>

          <form onSubmit={handleSubmit} className='flex flex-col container '>
            <label htmlFor='name' className='text-white-important text-xs'>
              Nome
            </label>
            <input
              id='name'
              type='text'
              name='name'
              required
              placeholder='nome'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-96 md:w-72 sm:w-32 mb-4 focus:border-primaryDark focus:ring-4 focus:ring-secondary focus:ring-opacity-50 focus:outline-none caret-secondary required  invalid:border-red-400 placeholder-primary peer peer-invalid:text-red-500 '
            />
            <p className='invisible peer-invalid:visible peer-focus:invisible text-xs text-primaryDark mt-[-12px]'>
              Esqueceu de colocar o seu nome. :(
            </p>
            <label htmlFor='email' className='text-white-important text-xs'>
              Email
            </label>
            <input
              id='email'
              type='email'
              name='email'
              required
              placeholder='email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-96 md:w-72 sm:w-32 mb-4 focus:border-primaryDark focus:ring-2 focus:ring-secondary focus:ring-opacity-50 focus:outline-none caret-secondary invalid:border-red-400 placeholder-primary'
            />
            <p className='invisible peer-invalid:visible peer-focus:invisible text-xs text-primaryDark mt-[-12px]'>
              vamos precisar do seu email. :(
            </p>
            <label htmlFor='email' className='text-white-important text-xs'>
              Senha
            </label>
            <input
              id='password'
              type='password'
              name='password'
              required
              placeholder='Senha'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-96 md:w-72 sm:w-32 mb-4 focus:border-primaryDark focus:ring-2 focus:ring-secondary focus:ring-opacity-50 focus:outline-none caret-secondary placeholder-primary'
            />
            <label htmlFor='email' className='text-white-important text-xs'>
              Repetir a senha
            </label>
            <input
              id='repeatPassword'
              type='password'
              name='repeatPassword'
              required
              placeholder='Repetir a senha'
              className='px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-96 md:w-72 sm:w-32 mb-4 focus:border-primaryDark focus:ring-2 focus:ring-secondary focus:ring-opacity-50 focus:outline-none caret-secondary placeholder-primary'
            />

            <button
              type='submit'
              className='bg-secondary mb-4 text-white-important px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark w-96 md:w-72 sm:w-32 transition duration-300 hover:scale-105'
            >
              Cadastrar
            </button>

            <button
              type='button'
              className='bg-secondary text-white-important flex items-center justify-center px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark w-96 md:w-72 sm:w-32 transition duration-300 hover:scale-105'
              onClick={() => signIn('google')}
            >
              <FcGoogle className='mr-2' size={24} />
              Login com Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroForm;
