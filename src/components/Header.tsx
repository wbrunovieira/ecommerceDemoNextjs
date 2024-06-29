import { BsInstagram, BsFacebook, BsTiktok } from "react-icons/bs";

import Logo from "/public/images/LogoStylos.svg";
import Home from "/public/icons/home.svg";

import CartButton from "./CartButton";
import SearchBox from "./SearchBox";

import AnimatedFlower from "./AnimatedFlower";
import Link from "next/link";

import LogginButton from "./LogginButton";

const Header = () => {
  return (
    <header className="bg-header-bg bg-cover bg-center h-36 flex justify-between items-center flex-col w-screen pt-4 px-8 mx-auto py-4 sm:h-48 md:h-48 lg:h-36 custom-header">
      <div className="flex justify-between items-center w-full mb-4 mt-4">
        <div className="social-icons flex gap-3">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsInstagram className="text-secondary transition duration-300 hover:scale-125" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsFacebook className="text-secondary transition duration-300 hover:scale-125" />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsTiktok className="text-secondary transition duration-300 hover:scale-125" />
          </a>
        </div>

        <div>
          <p className="text-xs text-fontColor font-light transition duration-300 hover:scale-110">
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
              <Home />
            </Link>
          </div>
        </div>

        <div className="flex justify-center search">
          <SearchBox />
        </div>
        <div className="flex justify-end gap-4 right">
          <LogginButton />
          <CartButton />
        </div>
        <AnimatedFlower />
      </div>
    </header>
  );
};

export default Header;
