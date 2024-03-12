import { BsSearch } from 'react-icons/bs';

const SearchBox = () => {
  return (
    <div className='flex justify-center items-center relative w-full'>
      <input
        type='search'
        placeholder='Digite o nome do produto'
        className='w-full text-fontcolor text-xs light pl-4 pr-10 py-2 rounded-full 
        sm:max-w-full md:max-w-full lg:max-w-full xl:max-w-full 2xl:max-w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border'
      />
      <button type='submit' className='absolute right-0 top-0 mt-2 mr-2'>
        <BsSearch className='text-primary' />
      </button>
    </div>
  );
};

export default SearchBox;
