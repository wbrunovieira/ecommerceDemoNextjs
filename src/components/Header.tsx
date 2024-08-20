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
                <div className="flex justify-center text-[0.6rem] md:text-xs text-fontColor text-secondary dark:text-primaryDark ">
                    <p>Entrega grátis a partir de R$ 200,00</p>
                </div>
            </div>

            <div className="flex justify-between items-center w-full">
                <Link href="/" passHref>
                    <Logo className="w-32 cursor-pointer" />
                </Link>

                <nav className="hidden md:flex gap-6">
                    <Link href="/" passHref>
                        <Home
                            width="25"
                            height="25"
                            className="hover:scale-125 transition duration-300 ease-in-out"
                        />
                    </Link>
                </nav>

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

        // <header className="bg-header-bg dark:bg-header-bg-dark bg-cover sm:h-48 md:h-48 lg:h-36 flex justify-between items-center flex-col w-screen pt-4 px-8 mx-auto custom-header">
        //     <div className="flex justify-between items-center w-full mb-4 mt-4">
        //         <SocialIcons />

        //         <div>
        //             <p className="text-xs text-fontColor font-light dark:text-darkFontColor transition duration-300 hover:scale-110">
        //                 Entrega grátis a partir de R$ 200,00
        //             </p>
        //         </div>
        //     </div>

        //     <div className='custom-grid items-center justify-between w-full text-secondary "'>
        //         <div className="flex gap-10 ">
        //             <div className="flex justify-start left w-48 ">
        //                 <Link href="/" passHref className="w-48 cursor-pointer">
        //                     <Logo />
        //                 </Link>
        //             </div>

        //             <div className="flex justify-start left w-48 place-items-center">
        //                 <Link
        //                     href="/"
        //                     passHref
        //                     className="cursor-pointer hover:scale-125 transition duration-300 ease-in-out"
        //                 >
        //                     <Home width="25" height="25" />
        //                 </Link>
        //             </div>
        //         </div>

        //         <div className="flex justify-center search">
        //             <SearchBox />
        //         </div>
        //         <div className="flex justify-end gap-4 right">
        //             <LogginButton />
        //             <ToggleMode />
        //             <CartButton />
        //         </div>
        //         <div>
        //             <AnimatedFlower />
        //         </div>
        //     </div>
        // </header>
    );
};

export default Header;
