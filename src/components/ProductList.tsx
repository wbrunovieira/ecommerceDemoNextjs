import React from 'react';

const ProductList = () => {
  const cards = Array.from({ length: 12 }, (_, index) => index + 1);

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4'>
      {cards.map((card) => (
        <div key={card} className='bg-white p-4 shadow rounded-lg'>
          <h2 className='text-xl font-bold'>Card {card}</h2>
          <p className='text-gray-500'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
