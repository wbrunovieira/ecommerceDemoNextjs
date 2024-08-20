import { useState } from 'react';
import { motion } from 'framer-motion'; // Para animação suave
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'; // Ícones de menu e fechar
import Link from 'next/link';

const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="md:hidden">
            <button
                className="text-primaryDark dark:text-primaryLight p-2"
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
            </button>

            {isOpen && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-0 right-0 h-full w-3/4 bg-primaryLight dark:bg-primaryDark z-50 p-4 shadow-lg"
                >
                    <nav className="flex flex-col gap-4">
                        {/* Header Options */}
                        <div className="flex flex-col gap-2">
                            <Link href="/">
                                <a className="text-primaryDark dark:text-primaryLight text-sm">
                                    Home
                                </a>
                            </Link>
                            <Link href="/cart">
                                <a className="text-primaryDark dark:text-primaryLight text-sm">
                                    Cart
                                </a>
                            </Link>
                            <Link href="/login">
                                <a className="text-primaryDark dark:text-primaryLight text-sm">
                                    Login
                                </a>
                            </Link>
                        </div>

                        <hr className="border-primaryDark dark:border-primaryLight" />

                        {/* Sidebar Options */}
                        <div className="flex flex-col gap-2">
                            <Link href="/category/lingeries">
                                <a className="text-primaryDark dark:text-primaryLight text-sm">
                                    Lingeries
                                </a>
                            </Link>
                            <Link href="/category/pijamas">
                                <a className="text-primaryDark dark:text-primaryLight text-sm">
                                    Pijamas
                                </a>
                            </Link>
                            <Link href="/category/acessorios">
                                <a className="text-primaryDark dark:text-primaryLight text-sm">
                                    Acessórios
                                </a>
                            </Link>
                        </div>
                    </nav>
                </motion.div>
            )}
        </div>
    );
};

export default MobileMenu;
