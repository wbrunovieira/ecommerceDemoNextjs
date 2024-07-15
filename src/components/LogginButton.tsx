"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { FaUserAlt } from "react-icons/fa";
import { FiLogOut } from 'react-icons/fi';
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const LogginButton = () => {

  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="text-xs">...</div>;
  }

  if (status === "loading") {
    return <div className="text-xs">...</div>;
  }

  if (session && session.user) {
    const userName = session.user?.name;
    

    return (
      <div className="flex items-center gap-2 ">
        <Link href={`/user/${session.user.id}`} passHref>
          <div className=" flex text-secondary dark:text-darkFontColor transition duration-300 hover:scale-110 text-xs font-semibold border p-2 rounded-md bg-primaryLight dark:bg-dark-secondary-gradient items-center">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt="Imagem do usuário"
                width={12}
                height={12}
                className="w-6 h-6 rounded-full  items-center mr-2 border border-secondary"
              />
            ) : (
              <FaUserAlt className="w-6 h-6 text-secondary  dark:text-primaryLight" />
            )}
            Olá, {userName}
          </div>
        </Link>
        <button
          className="hover:scale-110 text-xs mt-1 mb-2 bg-primaryLight p-1 rounded-md mb-2 relative"
          onClick={() => signOut()}
        >
        <FiLogOut className="w-6 h-6 text-secondary dark:text-primary" />
         
        </button>
      </div>
    );
  } else {
    return (
      <button
        className="flex text-secondary transition duration-300 hover:scale-110 text-xs font-semibold border px-4 py-2 h-6 rounded-md bg-primaryLight items-center mt-4"
        onClick={() => signIn()}
      >
        login
      </button>
    );
  }
};

export default LogginButton;
