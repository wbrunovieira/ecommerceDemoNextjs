import React, { useState } from 'react';

type FilterProps = {
  onFilter: (filters: Filters) => void;
};

type Filters = {
  price: number | null;
  color: string | null;
  sizes: string[];
  brands: string[];
  material: string | null;
};

const Filters: React.FC<FilterProps> = ({ onFilter }) => {
  const [filters, setFilters] = useState<Filters>({
    price: null,
    color: null,
    sizes: [],
    brands: [],
    material: null,
  });

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseInt(event.target.value);
    setFilters((prevFilters) => ({ ...prevFilters, price }));
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const color = event.target.value;
    setFilters((prevFilters) => ({ ...prevFilters, color }));
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const size = event.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      sizes: prevFilters.sizes.includes(size)
        ? prevFilters.sizes.filter((s) => s !== size)
        : [...prevFilters.sizes, size],
    }));
  };

  const handleBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const brand = event.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      brands: prevFilters.brands.includes(brand)
        ? prevFilters.brands.filter((b) => b !== brand)
        : [...prevFilters.brands, brand],
    }));
  };

  const handleMaterialChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const material = event.target.value;
    setFilters((prevFilters) => ({ ...prevFilters, material }));
  };

  const handleFilterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onFilter(filters);
  };

  return (
    <div className='p-4 bg-gray-100'>
      <form onSubmit={handleFilterSubmit}>
        <div className='mb-4'>
          <label htmlFor='price' className='block mb-2 font-medium'>
            Price
          </label>
          <input
            type='number'
            id='price'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            placeholder='Enter price'
            value={filters.price || ''}
            onChange={handlePriceChange}
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='color' className='block mb-2 font-medium'>
            Color
          </label>
          <select
            id='color'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            value={filters.color || ''}
            onChange={handleColorChange}
          >
            <option value=''>All</option>
            <option value='red'>Red</option>
            <option value='blue'>Blue</option>
            <option value='green'>Green</option>
          </select>
        </div>
        <div className='mb-4'>
          <label className='block mb-2 font-medium'>Sizes</label>
          <div className='space-x-2'>
            <label>
              <input
                type='checkbox'
                value='s'
                checked={filters.sizes.includes('s')}
                onChange={handleSizeChange}
              />{' '}
              S
            </label>
            <label>
              <input
                type='checkbox'
                value='m'
                checked={filters.sizes.includes('m')}
                onChange={handleSizeChange}
              />{' '}
              M
            </label>
            <label>
              <input
                type='checkbox'
                value='l'
                checked={filters.sizes.includes('l')}
                onChange={handleSizeChange}
              />{' '}
              L
            </label>
          </div>
        </div>
        <div className='mb-4'>
          <label className='block mb-2 font-medium'>Brands</label>
          <div className='space-x-2'>
            <label>
              <input
                type='checkbox'
                value='brand1'
                checked={filters.brands.includes('brand1')}
                onChange={handleBrandChange}
              />{' '}
              Brand 1
            </label>
            <label>
              <input
                type='checkbox'
                value='brand2'
                checked={filters.brands.includes('brand2')}
                onChange={handleBrandChange}
              />{' '}
              Brand 2
            </label>
            <label>
              <input
                type='checkbox'
                value='brand3'
                checked={filters.brands.includes('brand3')}
                onChange={handleBrandChange}
              />{' '}
              Brand 3
            </label>
          </div>
        </div>
        <div className='mb-4'>
          <label htmlFor='material' className='block mb-2 font-medium'>
            Material
          </label>
          <select
            id='material'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            value={filters.material || ''}
            onChange={handleMaterialChange}
          >
            <option value=''>All</option>
            <option value='cotton'>Cotton</option>
            <option value='silk'>Silk</option>
            <option value='polyester'>Polyester</option>
          </select>
        </div>
        <button
          type='submit'
          className='px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600'
        >
          Apply Filters
        </button>
      </form>
    </div>
  );
};

export default Filters;
