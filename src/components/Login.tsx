'use client';
import { redirect } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
type LoginFormInputs = {
  email: string;
  password: string;
};
const Login = () => {
  console.log('Componente Login carregado');
  const [inputs, setInputs] = useState<LoginFormInputs>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('handleSubmit');
    e.preventDefault();
    const response = await fetch('http://localhost:3333/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    });
    console.log('response ', response);
    const data = await response.json();
    console.log('data ', data);
    if (response.ok) {
      localStorage.setItem('accessToken', data.access_token);

      console.log('Login Successful:', data);
    } else {
      redirect('/cadastro');
      console.error('Login Failed:', data);
    }
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
              value={inputs.email}
              className='px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-96 md:w-72 sm:w-32 '
              onChange={handleChange}
            />
            <input
              type='password'
              name='password'
              placeholder='Senha'
              value={inputs.password}
              className='px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-96 md:w-72 sm:w-32'
              onChange={handleChange}
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
            <button
              type='button'
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
