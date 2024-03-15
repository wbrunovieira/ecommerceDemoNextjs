import React from 'react';

const Login = () => {
  return (
    <div className='fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-80'>
      <div className='bg-primaryLight p-12 rounded-lg shadow-lg'>
        <h2 className='text-2xl font-bold text-secondary mb-4'>Login</h2>
        <form className='flex flex-col space-y-4'>
          <input
            type='email'
            placeholder='Email'
            className='px-4 py-2 rounded-lg shadow-sm'
          />
          <input
            type='password'
            placeholder='senha'
            className='px-4 py-2 rounded-lg shadow-sm'
          />
          <button
            type='submit'
            className='bg-secondary text-white px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark'
          >
            Acessar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
