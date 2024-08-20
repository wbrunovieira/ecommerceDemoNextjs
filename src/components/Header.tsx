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

            {/* Segunda linha com logo, SearchBox e ícones - Desktop */}
            <div className="hidden md:flex justify-between items-center w-full">
                {/* Logo */}
                <Link href="/" passHref>
                    <Logo className="w-24 md:w-32 cursor-pointer" />
                </Link>

                {/* SearchBox centralizado */}
                <div className="flex flex-1 justify-center">
                    <SearchBox />
                </div>

                {/* Ícones de controle */}
                <div className="flex items-center gap-2 md:gap-4">
                    <LogginButton />
                    <ToggleMode />
                    <CartButton />
                    <MobileMenu />
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="flex md:hidden flex-wrap justify-between items-center w-full">
                {/* Logo */}
                <div className="flex items-center justify-between gap-2 md:gap-4 w-full">
                    <Link href="/" passHref>
                        <Logo className="w-24 md:w-32 cursor-pointer" />
                    </Link>
                    <MobileMenu />
                </div>

                {/* Ícones de controle no mobile (à direita) */}
                <div className="flex items-center justify-between gap-2 md:gap-4 w-full">
                    <div className="flex items-center gap-2">
                        <LogginButton />
                    </div>
                    <div className="flex items-center gap-2">
                        <ToggleMode />
                        <CartButton />
                    </div>
                </div>
            </div>

            {/* SearchBox para mobile */}
            <div className="flex justify-center mt-4 md:hidden">
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
