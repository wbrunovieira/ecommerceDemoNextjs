
import Logo from "/public/images/LogoStylos.svg";

import Link from "next/link";

import ToggleMode from "./ToggleMode";


const Header = () => {
 


  return (
    <header className="pt-2 pb-2 bg-primaryLight dark:bg-primaryDark sm:h-16 md:h-16 lg:h-16 flex justify-between items-center flex-col w-screen px-8 mx-auto">

      <div className='custom-grid-adm items-center justify-between w-full text-secondary "'>
        
          <div className="flex justify-start left w-32 ">
            <Link href="/" passHref className="w-32 cursor-pointer">
              <Logo />
            </Link>
          </div>

       

        <div className="flex justify-center search">


        </div>
        <div className="flex justify-end gap-4 right">
          
          <ToggleMode />
          
        </div>
       
      </div>
    </header>
  );
};

export default Header;
