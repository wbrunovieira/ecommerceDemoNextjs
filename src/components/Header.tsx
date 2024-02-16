import { BsInstagram, BsFacebook, BsTiktok } from 'react-icons/bs';

const Header = () => {
  return (
    <header className='bg-primary h-32 flex justify-center items-center'>
      <div className='subheader1 flex justify-between items-center w-full px-4'>
        <div className='social-icons flex gap-3'>
          <a
            href='https://instagram.com'
            className='group'
            target='_blank'
            rel='noopener noreferrer'
          >
            <BsInstagram className=' text-secondary transition-transform duration-300 hover:scale-120' />
          </a>
          <BsFacebook />
          <BsTiktok />
        </div>
      </div>
      <div className='header-message hover:scale-120'>
        Entrega grátis apartir de R$ 200,00
      </div>
    </header>
  );
};

export default Header;
