'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import Link from 'next/link';
import SideBarMobile from './SideBarMobile';

const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <div className="md:hidden">
            <button
                className="text-primaryDark dark:text-primaryLight p-2"
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                {isOpen ? (
                    <AiOutlineClose size={24} />
                ) : (
                    <AiOutlineMenu size={24} />
                )}
            </button>

            {isOpen && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-0 right-0 h-full w-2/3 bg-primaryLight dark:bg-primaryDark z-50 shadow-lg"
                >
                    <div className="flex justify-between items-center p-4">
                        <h2 className="text-lg font-bold text-primaryDark dark:text-primaryLight">
                            Menu
                        </h2>
                        <button
                            className="text-primaryDark dark:text-primaryLight p-2 z-50"
                            onClick={toggleMenu}
                            aria-label="Close menu"
                        >
                            <AiOutlineClose size={24} />
                        </button>
                    </div>
                    <nav
                        className="flex flex-col gap-4 p-4 overflow-y-auto"
                        style={{ maxHeight: 'calc(100vh - 64px)' }}
                    >
                        {/* Header Options */}

                        <div className="flex flex-col gap-2">
                            <Link
                                href="/"
                                className="text-primaryDark dark:text-primaryLight text-sm"
                            >
                                Home
                            </Link>
                            <Link
                                href="/cart"
                                className="text-primaryDark dark:text-primaryLight text-sm"
                            >
                                Cart
                            </Link>
                            <Link
                                href="/login"
                                className="text-primaryDark dark:text-primaryLight text-sm"
                            >
                                Login
                            </Link>
                        </div>

                        <hr className="border-primaryDark dark:border-primaryLight" />

                        {/* Sidebar Options */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-lg font-bold text-primaryDark dark:text-primaryLight">
                                Filtros
                            </h2>
                            <SideBarMobile />

                            <Link
                                href="/category/lingeries"
                                className="text-primaryDark dark:text-primaryLight text-sm"
                            >
                                Lingeries
                            </Link>
                            <Link
                                href="/category/pijamas"
                                className="text-primaryDark dark:text-primaryLight text-sm"
                            >
                                Pijamas
                            </Link>
                            <Link
                                href="/category/acessorios"
                                className="text-primaryDark dark:text-primaryLight text-sm"
                            >
                                Acessórios
                            </Link>
                        </div>
                    </nav>
                </motion.div>
            )}
        </div>
    );
};

export default MobileMenu;
