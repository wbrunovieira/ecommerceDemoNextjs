'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FaUserAlt } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const LogginButton = () => {
    const { data: session, status } = useSession();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <div className="text-xs">...</div>;
    }

    if (status === 'loading') {
        return <div className="text-xs">...</div>;
    }

    if (session && session.user) {
        const truncateName = (name, maxLength = 15) => {
            const firstName = name.split(' ')[0];
            return firstName.length > maxLength
                ? firstName.slice(0, maxLength) + '...'
                : firstName;
        };
        const userName = truncateName(session.user?.name);

        return (
            <div className="flex items-center gap-1">
                <Link href={`/user/${session.user.id}`} passHref>
                    <div className="flex items-center gap-2 text-primary2 dark:text-darkFontColor transition duration-300 hover:scale-110 text-[0.6rem] md:text-xs font-semibold border px-2 py-0 md:px-3 md:py-2 rounded-md bg-primaryLight dark:bg-dark-secondary-gradient h-10">
                        {session.user?.image ? (
                            <Image
                                src={session.user.image}
                                alt="Imagem do usuário"
                                width={24}
                                height={24}
                                className="w-2 md:w-4 h-4 rounded-full items-center border border-secondary"
                            />
                        ) : (
                            <FaUserAlt className="w-3 h-3 md:w-6 md:h-6 text-primary2 dark:text-primaryLight text-xs" />
                        )}
                        Olá, {userName}
                    </div>
                </Link>
                <button
                    className="hover:scale-110 text-xs bg-primaryLight p-2 rounded-md flex items-center justify-center h-10 w-10"
                    onClick={() => signOut()}
                >
                    <FiLogOut className="w-6 h-6 text-primary2 dark:text-primaryLight" />
                </button>
            </div>
        );
    } else {
        return (
            <button
                className="flex text-primary2 transition duration-300 hover:scale-110 text-xs font-semibold border px-4 py-2 h-8 rounded-md bg-primaryLight items-center mt-4"
                onClick={() => signIn()}
            >
                login
            </button>
        );
    }
};

export default LogginButton;
