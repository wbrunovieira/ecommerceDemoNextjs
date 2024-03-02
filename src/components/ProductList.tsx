import React from 'react';
import Card from './Card';

const ProductList = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4'>
      <Card
        title='Produto 1'
        category='Lingerie'
        precoAntigo={150}
        precoNovo={120}
        emPromocao={false}
        eNovidade={true}
        desconto={15}
        imageSRC='/images/foto1.jpg'
      />
      <Card
        title='Produto 2'
        category='Lingerie'
        precoAntigo={80}
        precoNovo={60}
        emPromocao={true}
        desconto={10}
        imageSRC='/images/foto1.jpg'
      />
      <Card
        title='Produto 3'
        category='Lingerie'
        precoAntigo={80}
        precoNovo={60}
        emPromocao={true}
        desconto={10}
        imageSRC='/images/foto1.jpg'
      />
    </div>
  );
};

export default ProductList;
