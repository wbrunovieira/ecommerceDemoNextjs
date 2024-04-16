'use client';

import React, { useState } from 'react';
import { BsInstagram, BsFacebook, BsTiktok, BsCart4 } from 'react-icons/bs';
import Image from 'next/image';
import Logo from '/public/images/LogoStylos.svg';

import SearchBox from './SearchBox';
import Button from './Button';
import FloatCart from './FloatCart';
import AnimatedFlower from './AnimatedFlower';
import Link from 'next/link';

const Header = () => {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const toggleCartModal = () => {
    setIsCartModalOpen(!isCartModalOpen);
  };

  return (
    <header className='bg-header-bg bg-cover bg-center h-36 flex justify-between items-center flex-col w-screen pt-4 px-8 mx-auto py-4 sm:h-48 md:h-48 lg:h-36 custom-header'>
      <div className='flex justify-between items-center w-full mb-4 mt-4'>
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

        <div>
          <p className='text-xs text-fontColor font-light transition duration-300 hover:scale-110'>
            Entrega grátis a partir de R$ 200,00
          </p>
        </div>
      </div>

      <div className='custom-grid items-center justify-between w-full text-secondary "'>
        <div className='flex justify-start left w-48'>
          <Link href='/' passHref className='w-48'>
            <Logo />
          </Link>
        </div>

        <div className='flex justify-center search'>
          <SearchBox />
        </div>
        <div className='flex justify-end gap-4 right'>
          <Link href='/login' passHref>
            <Button variant='secondary' size='small'>
              Login
            </Button>
          </Link>
          <button
            onClick={toggleCartModal}
            className='flex items-center justify-center hover:scale-110 transition duration-300 bg-primaryLight rounded-full p-2 h-12 w-12'
          >
            <div className='relative'>
              <BsCart4 size={32} />
              <span className='absolute -bottom-2 -right-4 opacity-70 bg-primaryDark text-primaryLight border border-primaryDark text-[10px] rounded-full px-2 py-2 min-w-[20px] h-[20px] flex items-center justify-center'>
                3
              </span>
            </div>
          </button>
          {isCartModalOpen && <FloatCart onClose={toggleCartModal} />}
        </div>
        <AnimatedFlower />
      </div>
    </header>
  );
};

export default Header;
