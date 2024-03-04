import Image from 'next/image';

interface SimilarProductsProps {
  title: string;
  image: string;

  price: number;
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({
  title,
  image,
  price,
}) => {
  return (
    <div className='flex flex-col h-auto w-auto'>
      <div className='w-full flex mb-4 '>
        <h2 className='text-lg text-primaryDark font-semibold border border-light rounded p-4 whitespace-nowrap'>
          Produtos Parecidos
        </h2>
      </div>
      <div className='flex border border-light rounded p-4'>
        <div>
          <Image
            className='border rounded'
            src={image}
            alt='liz1'
            width={100}
            height={100}
          />
        </div>
        <div className='flex flex-col ml-2'>
          <h3 className=' text-fontColor font-semibold text-sm'>{title}</h3>
          <div className='flex justify-center items-center gap-2'>
            <Image
              src='/icons/heart-icon.svg'
              alt='Heart Icon'
              width={20}
              height={20}
            />
            <p className='text-xs mt-2 mb-2'>Lista de Desejos</p>
          </div>
          <p className='text-sm text-fontColor font-semibold text-center'>
            {price}
          </p>
          <div className='flex justify-center items-center py-2 mt-2 border border-light rounded'>
            <Image
              src='/icons/cart-mini.svg'
              alt='Heart Icon'
              width={20}
              height={20}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimilarProducts;
