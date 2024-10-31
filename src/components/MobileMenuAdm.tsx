'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

const AdminMobileMenu = ({ setCurrentView, setIsSheetOpen }) => {
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
                className="text-primaryDark  p-2"
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
                    className=" fixed top-0 right-0 h-full w-full bg-primaryLight  z-50 shadow-lg"
                >
                    <div className="flex justify-between items-center p-4">
                        <h2 className="text-lg font-bold text-primaryDark ">
                            Admin Menu
                        </h2>
                        <button
                            className="text-primaryDark  p-2 z-50"
                            onClick={toggleMenu}
                            aria-label="Close menu"
                        >
                            <AiOutlineClose size={24} />
                        </button>
                    </div>
                    <nav
                        className="flex flex-col gap-4 px-4 "
                        style={{ maxHeight: 'calc(100vh - 64px)' }}
                    >
                        {/* Sidebar Options */}
                        <div className="flex flex-col gap-2 w-full">
                            <h2 className="text-lg font-bold text-primaryDark ">
                                Admin
                            </h2>
                            <div className="flex  flex-col gap-2 text-left">
                                <button
                                    className="hover:bg-primary hover:scale-110 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2 text-primaryDark  text-left"
                                    onClick={() => {
                                        setIsSheetOpen(true);
                                        setCurrentView('products');
                                        console.log(
                                            'Products button  do mobile'
                                        );
                                    }}
                                >
                                    Produtos
                                </button>
                                <button
                                    className="hover:bg-primary hover:scale-110 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2 text-primaryDark  text-left"
                                    onClick={() => {
                                        setIsSheetOpen(true);
                                        setCurrentView('categories');
                                    }}
                                >
                                    Categorias
                                </button>
                                <button
                                    className="hover:bg-primary hover:scale-110 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2 text-primaryDark  text-left"
                                    onClick={() => {
                                        setIsSheetOpen(true);
                                        setCurrentView('colors');
                                    }}
                                >
                                    Cores
                                </button>
                                <button
                                    className="hover:bg-primary hover:scale-110 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2 text-primaryDark  text-left"
                                    onClick={() => {
                                        setIsSheetOpen(true);
                                        setCurrentView('sizes');
                                    }}
                                >
                                    Tamanhos
                                </button>
                                <button
                                    className="hover:bg-primary hover:scale-110 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2 text-primaryDark  text-left"
                                    onClick={() => {
                                        setIsSheetOpen(true);
                                        setCurrentView('brands');
                                    }}
                                >
                                    Fabricantes
                                </button>

                                <button
                                    className="hover:bg-primary hover:scale-110 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2 text-primaryDark  text-left"
                                    onClick={() => {
                                        setIsSheetOpen(true);
                                        setCurrentView('sizes');
                                    }}
                                >
                                    Tamanhos
                                </button>
                                <button
                                    className="hover:bg-primary hover:scale-110 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2 text-primaryDark  text-left"
                                    onClick={() => {
                                        setIsSheetOpen(true);
                                        setCurrentView('orders');
                                    }}
                                >
                                    Pedidos
                                </button>
                            </div>
                        </div>
                    </nav>
                </motion.div>
            )}
        </div>
    );
};

export default AdminMobileMenu;
