import Logo from '/public/images/LogoStylos.svg';
import Home from '/public/icons/home.svg';

import CartButton from './CartButton';
import SearchBox from './SearchBox';

import AnimatedFlower from './AnimatedFlower';
import Link from 'next/link';

import LogginButton from './LogginButton';
import ToggleMode from './ToggleMode';
import { SocialIcons } from './SocialIcons';
import MobileMenu from './MobileMenu';

const Header = () => {
    return (
        <header className="bg-header-bg dark:bg-header-bg-dark bg-cover py-2 px-4 w-full">
            {/* Primeira linha com ícones sociais e mensagem */}
            <div className="flex justify-between items-center w-full mb-2 md:mb-4">
                <div className="flex items-center">
                    <SocialIcons className="flex gap-2 md:gap-3" />
                </div>
                <div className="flex justify-center text-[0.6rem] md:text-xs text-fontColor text-primary2 dark:text-primaryDark">
                    <p>Entrega grátis a partir de R$ 200,00</p>
                </div>
            </div>

            {/* Segunda linha com logo e ícones */}
            <div className="flex justify-between items-center w-full flex-wrap">
                {/* Logo */}
                <Link href="/" passHref>
                    <Logo className="w-24 md:w-32 cursor-pointer" />
                </Link>

                {/* Ícones de controle no mobile (à direita) */}
            </div>

            <div className="flex items-center justify-between gap-2 md:gap-4">
                {' '}
                <div className="flex items-center gap-2">
                    <LogginButton />
                </div>
                
                <div className="flex items-center gap-2">
                    <ToggleMode />
                    <CartButton />
                    <MobileMenu />
                </div>
            </div>
            <div className="flex justify-center mt-4">
                <SearchBox />
            </div>

            {/* Flor animada apenas em desktop */}
            <div className="hidden md:flex justify-center mt-4">
                <AnimatedFlower />
            </div>
        </header>
    );
};

export default Header;
