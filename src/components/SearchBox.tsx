import { BsSearch } from 'react-icons/bs';

const SearchBox = () => {
  return (
    <div className='flex justify-center items-center w-full'>
      <div className='relative max-w-lg'>
        <input
          style={{ width: '500px' }}
          type='search'
          placeholder='Digite o nome do produto'
          className='text-fontcolor text-xs light pl-4 pr-10 py-2 rounded-full focus:outline-none focus:border-pink-500 transition-colors w-full'
        />
        <button type='submit' className='absolute right-0 top-0 mt-2 mr-2'>
          <BsSearch className='text-primary' />
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
