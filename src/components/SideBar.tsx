import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Sidebar = () => {
  const sidebarItems = [
    { src: '/icons/lingerie-mini.svg', title: 'Lingerie' },
    { src: '/icons/pijamas-mini.svg', title: 'Pijamas' },
    { src: '/icons/moda-mini.svg', title: 'Moda Fitness' },
    { src: '/icons/glasses-mini.svg', title: 'Óculos' },
    { src: '/icons/bag-mini.svg', title: 'Bolsas' },
    { src: '/icons/perfume-mini.svg', title: 'Perfumes' },
    { src: '/icons/boy.svg', title: 'Homens' },
  ];

  const sidebarFabricantes = [
    { src: '/icons/logo-liz.svg', title: 'Liz' },
    { src: '/icons/logo-nayne.jpeg', title: 'Nayane' },
  ];

  return (
    <nav className='flex flex-col gap-2'>
      <div className='flex flex-col w-64 border border-light p-4 mt-2'>
        <h2 className='text-primaryDark text-base tracking-wider'>
          Categorias
        </h2>
        {sidebarItems.map((item, index) => (
          <div key={index}>
            <Link href={item.title} className='flex items-center py-4'>
              <Image
                src={item.src}
                width={20}
                height={20}
                alt=''
                className='mr-2'
              ></Image>
              <div className='text-xs'>{item.title}</div>
            </Link>
          </div>
        ))}
      </div>

      <div className='flex flex-col w-64 border border-light p-4 mt-2'>
        <h2 className='text-primaryDark text-base tracking-wider'>Marcas</h2>
        {sidebarFabricantes.map((item, index) => (
          <div key={index}>
            <Link href={item.title} className='flex items-center py-4'>
              <Image
                src={item.src}
                width={20}
                height={20}
                alt=''
                className='mr-2'
              ></Image>
              <div className='text-xs'>{item.title}</div>
            </Link>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
