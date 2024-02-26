import React from 'react';
import { BsInstagram, BsFacebook, BsTiktok, BsCart4 } from 'react-icons/bs';
import Image from 'next/image';
import logo from '/public/logo-prov.svg';
import SearchBox from './SearchBox';
import Button from './Button';

const Header = () => {
  return (
    <header className='bg-primary h-32 flex justify-center items-center flex-col mx-auto px-16  pt-4'>
      <div className='flex justify-between items-center w-full mb-4'>
        <div className='social-icons flex gap-3'>
          <a
            href='https://instagram.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <BsInstagram className='text-secondary transition duration-300 hover:scale-125' />
          </a>
          <a
            href='https://facebook.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <BsFacebook className='text-secondary transition duration-300 hover:scale-125' />
          </a>
          <a
            href='https://tiktok.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <BsTiktok className='text-secondary transition duration-300 hover:scale-125' />
          </a>
        </div>
        <p className='text-xs text-fontColor font-light transition duration-300 hover:scale-110'>
          Entrega grátis a partir de R$ 200,00
        </p>
      </div>
      <hr className='w-full border-t line-white ' />
      <div className='flex justify-between items-center w-full  text-secondary'>
        <Image
          src={logo}
          alt='logo'
          width={100}
          height={100}
          className='mt-4 mb-4'
        />
        <div className='w-full'>
          <SearchBox />
        </div>
        <div className='flex gap-4'>
          <Button variant='secondary' size='small'>
            Login
          </Button>
          <BsCart4 size={32} />
        </div>
      </div>
    </header>
  );
};

export default Header;
