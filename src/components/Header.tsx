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
        <header className="bg-header-bg dark:bg-header-bg-dark bg-cover py-4 px-8 w-screen">
            <div className="flex justify-between items-center w-full mb-4">
                <div className="flex items-center">
                    <SocialIcons className="flex flex gap-2 md:gap-3" />
                </div>
                <div className="flex justify-center text-[0.6rem] md:text-xs text-fontColor text-primary2 dark:text-primaryDark ">
                    <p>Entrega grátis a partir de R$ 200,00</p>
                </div>
            </div>

            <div className="flex gap-2 md:gap-3 justify-between items-center w-full">
                <Link href="/" passHref>
                    <Logo className="w-24 md:w-32 cursor-pointer" />
                </Link>

                <div className="flex pt-2 gap-2 md:gap-6 hover:scale-110 ">
                    <Link
                        href="/"
                        className="flex rounded-md bg-primaryLight px-2 py-1 gap-1 justify-center items-center"
                        passHref
                    >
                        <Home
                            width="12"
                            height="12"
                            className="transition duration-300 ease-in-out"
                        />
                        <p className="text-primary2 dark:text-primaryDark  text-[0.6rem] md:text-xs">
                            Home
                        </p>
                    </Link>
                </div>

                <div className="hidden md:flex justify-center w-full">
                    <SearchBox />
                </div>

                <div className="flex items-center gap-4">
                    <LogginButton />
                    <ToggleMode />
                    <CartButton />
                </div>
            </div>

            <div className="flex md:hidden justify-center mt-4">
                <SearchBox />
            </div>

            <div className="hidden md:flex justify-center mt-4">
                <AnimatedFlower />
            </div>
        </header>


    );
};

export default Header;
