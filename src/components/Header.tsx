import React from 'react';
import { BsInstagram, BsFacebook, BsTiktok } from 'react-icons/bs';
import Image from 'next/image';
import logo from '/public/logo-prov.svg';
import SearchBox from './SearchBox';

const Header = () => {
  return (
    <header className='bg-primary h-32 flex justify-center items-end flex-col'>
      <div className='flex justify-between items-end w-full px-4 max-w-7xl'>
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
      <div className='flex justify-between items-end w-full px-4 max-w-7xl'>
        <Image src={logo} alt='logo' width={100} height={100} />
        <SearchBox />
      </div>
    </header>
  );
};

export default Header;
