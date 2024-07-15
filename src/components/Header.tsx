

import Logo from '/public/images/LogoStylos.svg';
import Home from '/public/icons/home.svg';

import CartButton from './CartButton';
import SearchBox from './SearchBox';

import AnimatedFlower from './AnimatedFlower';
import Link from 'next/link';

import LogginButton from './LogginButton';
import ToggleMode from './ToggleMode';
import { SocialIcons } from './SocialIcons';

const Header = () => {
    return (
        <header className="bg-header-bg dark:bg-header-bg-dark bg-cover sm:h-48 md:h-48 lg:h-36 flex justify-between items-center flex-col w-screen pt-4 px-8 mx-auto custom-header">
            <div className="flex justify-between items-center w-full mb-4 mt-4">
                <SocialIcons />

                <div>
                    <p className="text-xs text-fontColor font-light dark:text-darkFontColor transition duration-300 hover:scale-110">
                        Entrega grátis a partir de R$ 200,00
                    </p>
                </div>
            </div>

            <div className='custom-grid items-center justify-between w-full text-secondary "'>
                <div className="flex gap-10 ">
                    <div className="flex justify-start left w-48 ">
                        <Link href="/" passHref className="w-48 cursor-pointer">
                            <Logo />
                        </Link>
                    </div>

                    <div className="flex justify-start left w-48 place-items-center">
                        <Link
                            href="/"
                            passHref
                            className="cursor-pointer hover:scale-125 transition duration-300 ease-in-out"
                        >
                            <Home width="25" height="25" />
                        </Link>
                    </div>
                </div>

                <div className="flex justify-center search">
                    <SearchBox />
          
                </div>
                <div className="flex justify-end gap-4 right">
                    <LogginButton />
                    <ToggleMode />
                    <CartButton />
                </div>
                <div>
                    <AnimatedFlower />
                </div>
            </div>
        </header>
    );
};

export default Header;
