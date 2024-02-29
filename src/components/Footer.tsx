import Image from 'next/image';
import { MdPix } from 'react-icons/md';
import { CiBank } from 'react-icons/ci';

const Footer: React.FC = () => {
  return (
    <footer className='bg-primaryDark text-white-important mt-4 '>
      <div className='container mx-auto py-8 px-8'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
          <div>
            <h3 className='text-base font-semibold mb-4 tracking-wide'>
              Categorias Populares{' '}
            </h3>
            <ul className='space-y-2 text-[#787878] text-xs'>
              <li>
                <a href='#'>Lingerie</a>
              </li>
              <li>
                <a href='#'>Promoções</a>
              </li>
              <li>
                <a href='#'>Cosméticos</a>
              </li>
              <li>
                <a href='#'>Para o meu Boy</a>
              </li>
              <li>
                <a href='#'>Nayne</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='text-base font-semibold mb-4 tracking-wide'>
              Produtos
            </h3>
            <ul className='space-y-2 text-[#787878] text-xs'>
              <li>
                <a href='#'>Lingerie</a>
              </li>
              <li>
                <a href='#'>Pijamas</a>
              </li>
              <li>
                <a href='#'>Cosméticos</a>
              </li>
              <li>
                <a href='#'>Para o meu Boy</a>
              </li>
              <li>
                <a href='#'>Perfumes</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='text-base font-semibold mb-4 tracking-wide'>
              Stylos
            </h3>
            <ul className='space-y-2 text-[#787878] text-xs'>
              <li>
                <a href='#'>Quem somos</a>
              </li>
              <li>
                <a href='#'>Para quem é</a>
              </li>
              <li>
                <a href='#'>Termos e Condições</a>
              </li>
              <li>
                <a href='#'>Entregas</a>
              </li>
              <li>
                <a href='#'>Pagamentos Seguros</a>
              </li>
            </ul>
          </div>
        </div>
        <h3 className='text-white-important flex justify-center align-center mt-8'>
          Pagamento Seguro
        </h3>
        <div className='flex gap-2 text-[9px] text-[#787878] justify-center align-center mt-2'>
          <div className='flex flex-col justify-center items-center'>
            <MdPix size={20} className='text-white-important' />
            <p className='mt-1 text-center'>Pix</p>
          </div>
          <div className='flex flex-col justify-center items-center'>
            <Image
              src={'/icons/debit-card.svg'}
              alt='cartao de debito'
              width={20}
              height={20}
            />
            <p className='mt-1 text-center'>Débito</p>
          </div>
          <div className='flex flex-col justify-center items-center'>
            <Image
              src={'/icons/credit-card.svg'}
              alt='cartao de debito'
              width={20}
              height={20}
            />
            <p className='mt-1 text-center'>Crédito</p>
          </div>
          <div className='flex flex-col justify-center items-center'>
            <CiBank size={20} className='text-white-important' />

            <p className='mt-1 text-center'>Boleto</p>
          </div>
          <div className='flex flex-col justify-center items-center'>
            <Image
              src={'/icons/visa.svg'}
              alt='cartao de debito'
              width={20}
              height={20}
            />
            <p className='mt-1 text-center'>Visa</p>
          </div>
          <div className='flex flex-col justify-center items-center'>
            <Image
              src={'/icons/mastercard.svg'}
              alt='cartao de debito'
              width={20}
              height={20}
              className=''
            />
            <p className='mt-1 text-center'>Mastercard</p>
          </div>
        </div>
      </div>
      <a
        className='text-[#ebe8e8] text-xs flex justify-center align-center pb-2'
        href='https://www.wbdigitalsolutions.com/'
        target='_blank'
      >
        <p>Copyright © WB Digital Solutions</p>
      </a>
    </footer>
  );
};

export default Footer;
