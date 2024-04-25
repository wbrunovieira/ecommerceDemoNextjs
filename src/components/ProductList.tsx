'use client';
import React, { useEffect, useState } from 'react';

import Card from './Card';

interface Produto {
  id: string;
  name: string;
  description: string;
  price: number;
  FinalPrice: number;
  onSale: boolean;
  isNew: boolean;
  discount: number;
  images: string[];
}

const ProductList = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch(
          'http://localhost:3333/products/featured-products'
        );
        const data = await response.json();
        console.log('data', data);
        setProdutos(data.products);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProdutos();
  }, []);
  console.log('produtos', produtos);
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4'>
      {produtos.map((produto) => (
        <Card
          key={produto.id}
          title={produto.name}
          category={produto.description}
          precoAntigo={produto.onSale ? produto.price : undefined}
          precoNovo={produto.FinalPrice || produto.price}
          emPromocao={produto.onSale}
          desconto={produto.discount}
          imageSRC={produto.images[0]}
          eNovidade={produto.isNew}
        />
      ))}
    </div>
  );
};

export default ProductList;
