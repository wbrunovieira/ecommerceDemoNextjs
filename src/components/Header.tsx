'use client';

// import React, { useState, useEffect, use } from 'react';

// import { BsInstagram, BsFacebook, BsTiktok, BsCart4 } from 'react-icons/bs';
// import Image from 'next/image';
// import logo from '/public/images/LogoStylos.svg';

// import SearchBox from './SearchBox';
// import Button from './Button';
// import FloatCart from './FloatCart';

// const Header = () => {
//   const [isCartModalOpen, setIsCartModalOpen] = useState(false);

//   const toggleCartModal = () => {
//     setIsCartModalOpen(!isCartModalOpen);
//   };

//   return (
//     <header className='bg-header-bg bg-cover bg-center h-32 flex justify-center items-center flex-col px-16 w-screen  pt-4'>
//       <div className='flex justify-between items-center w-full mb-4 mt-4'>
//         <div className='social-icons flex gap-3'>
//           <a
//             href='https://instagram.com'
//             target='_blank'
//             rel='noopener noreferrer'
//           >
//             <BsInstagram className='text-secondary transition duration-300 hover:scale-125' />
//           </a>
//           <a
//             href='https://facebook.com'
//             target='_blank'
//             rel='noopener noreferrer'
//           >
//             <BsFacebook className='text-secondary transition duration-300 hover:scale-125' />
//           </a>
//           <a
//             href='https://tiktok.com'
//             target='_blank'
//             rel='noopener noreferrer'
//           >
//             <BsTiktok className='text-secondary transition duration-300 hover:scale-125' />
//           </a>
//         </div>

//         <p className='text-xs text-fontColor font-light transition duration-300 hover:scale-110'>
//           Entrega grátis a partir de R$ 200,00
//         </p>
//       </div>

//       <div className='flex justify-between items-center w-full text-secondary'>
//         <div className='mb-4 '>
//           <Image
//             src={logo}
//             alt='logo'
//             width={200}
//             height={200}
//             className='mt-4 mb-4'
//           />
//         </div>
//         <div className='w-full sm:w-1/3 md:w-1/3 lg:w-full'>
//           <SearchBox />
//         </div>
//         <div className='flex gap-4'>
//           <Button variant='secondary' size='small'>
//             Login
//           </Button>
//           <button
//             onClick={toggleCartModal}
//             className='flex items-center justify-center hover:scale-110 transition duration-300 bg-primaryLight  rounded-full p-2 h-12 w-12'
//           >
//             <div className='relative'>
//               <BsCart4 size={32} />

//               <span className='absolute -bottom-2 -right-4 opacity-70 bg-primaryDark text-primaryLight border border-primaryDark text-[10px] rounded-full px-2 py-2 min-w-[20px] h-[20px] flex items-center justify-center'>
//                 3{' '}
//               </span>
//             </div>
//           </button>
//           {isCartModalOpen && <FloatCart onClose={toggleCartModal} />}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useState } from 'react';
import { BsInstagram, BsFacebook, BsTiktok, BsCart4 } from 'react-icons/bs';
import Image from 'next/image';
import logo from '/public/images/LogoStylos.svg';

import SearchBox from './SearchBox';
import Button from './Button';
import FloatCart from './FloatCart';

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

        <p className='text-xs text-fontColor font-light transition duration-300 hover:scale-110'>
          Entrega grátis a partir de R$ 200,00
        </p>
      </div>

      <div className='custom-grid items-center justify-between w-full text-secondary "'>
        <div className='flex justify-start left'>
          <Image src={logo} alt='logo' width={200} height={200} className='' />
        </div>

        <div className='flex justify-center search'>
          <SearchBox />
        </div>
        <div className='flex justify-end gap-4 right'>
          <Button variant='secondary' size='small'>
            Login
          </Button>
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
      </div>
      {/* <div className='grid grid-cols-3 items-center justify-between w-full text-secondary "'>
        <div className='flex justify-start'>
          <Image src={logo} alt='logo' width={200} height={200} className='' />
        </div>

        <div className='flex justify-center '>
          <SearchBox />
        </div>
        <div className='flex justify-end gap-4'>
          <Button variant='secondary' size='small'>
            Login
          </Button>
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
      </div> */}
    </header>
  );
};

export default Header;
