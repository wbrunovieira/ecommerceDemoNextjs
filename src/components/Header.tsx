import Home from '/public/icons/home.svg';
import Image from 'next/image';
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
        <header className="bg-header-bg dark:bg-header-bg-dark bg-cover py-2 px-4 w-full relative">
            <div className="flex justify-between items-center w-full mb-2 md:mb-4">
                <div className="flex items-center">
                    <SocialIcons className="flex gap-2 md:gap-3" />
                </div>
                <div className="flex justify-center text-[0.6rem] md:text-xs text-fontColor text-primary2 dark:text-primaryDark">
                    <p>Entrega grátis a partir de R$ 200,00</p>
                </div>
            </div>

            <div className="hidden md:flex justify-between items-center w-full">
                <Link
                    href="/"
                    passHref
                    className="flex gap-2 items-center justify-center "
                >
                    <Image
                        src="/images/LogoStylos.png"
                        width={96}
                        height={96}
                        alt="logo"
                        className="mr-2 max-w-full"
                        style={{ height: 'auto' }}
                    />
                    <div className="flex gap-2 items-center justify-center rounded-md bg-primaryLight px-2 py-1 hover:scale-110 transition duration-300 ease-in-out ">
                        <Home width="12" height="12" />
                        <p className="text-primary2 dark:text-primaryDark  text-[0.6rem] md:text-xs">
                            Home
                        </p>
                    </div>
                </Link>

                <div className="flex flex-1 justify-center">
                    <SearchBox />
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <LogginButton />
                    <ToggleMode />
                    <CartButton />
                    <MobileMenu />
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="flex  flex-wrap justify-between items-center w-full max-w-full md:hidden">
                <div className="flex items-center justify-between gap-2 md:gap-4 w-full">
                    <Link href="/" passHref className="hover:scale-110">
                        <Image
                            src="/images/LogoStylos.png"
                            width={96}
                            height={96}
                            alt="logo"
                            className="mr-2"
                        />
                    </Link>
                    <MobileMenu />
                </div>

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

            <div className="flex justify-center mt-4 md:hidden">
                <SearchBox />
            </div>

            <div className="md:flex justify-center mt-48 absolute ">
                <AnimatedFlower />
            </div>
        </header>
    );
};

export default Header;
