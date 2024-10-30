import Image from 'next/image';
import { MdPix } from 'react-icons/md';
import { CiBank, CiCreditCard1 } from 'react-icons/ci';
import { RiVisaLine, RiMastercardLine } from 'react-icons/ri';
import { SiMercadopago } from 'react-icons/si';
import Link from 'next/link';
import { BsCreditCard, BsLockFill } from 'react-icons/bs';

const Footer: React.FC = () => {
    return (
        <footer className="bg-primaryDark text-white-important mt-8">
            <div className="container mx-auto py-8 px-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4 p-4 md:place-items-stretch md:items-start">
                    <div className="md:justify-self-start">
                        <h3 className="text-base font-semibold mb-4 tracking-wide pl-2">
                            Categorias Populares
                        </h3>
                        <ul className="space-y-2 text-primary text-xs">
                            <li>
                                <Link
                                    className="inline-block hover:text-primary2 transition-transform duration-300 ease-in-out  hover:shadow-lg tracking-wide hover:shadow-secondary p-2 rounded-lg hover:scale-105 focus:outline-none focus:ring-1 focus:ring-primary "
                                    href=""
                                >
                                    Lingerie
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="inline-block hover:text-primary2 transition-transform duration-300 ease-in-out  hover:shadow-lg tracking-wide hover:shadow-secondary p-2 rounded-lg hover:scale-105 focus:outline-none focus:ring-1 focus:ring-primary"
                                    href="#"
                                >
                                    Promoções
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="inline-block hover:text-primary2 transition-transform duration-300 ease-in-out  hover:shadow-lg tracking-wide hover:shadow-secondary p-2 rounded-lg hover:scale-105 focus:outline-none focus:ring-1 focus:ring-primary"
                                    href="#"
                                >
                                    Cosméticos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="inline-block hover:text-primary2 transition-transform duration-300 ease-in-out  hover:shadow-lg tracking-wide hover:shadow-secondary p-2 rounded-lg hover:scale-105 focus:outline-none focus:ring-1 focus:ring-primary"
                                    href="#"
                                >
                                    Para o meu Boy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="inline-block hover:text-primary2 transition-transform duration-300 ease-in-out  hover:shadow-lg tracking-wide hover:shadow-secondary p-2 rounded-lg hover:scale-105 focus:outline-none focus:ring-1 focus:ring-primary"
                                    href="#"
                                >
                                    Nayne
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:justify-self-center">
                        <h3 className="text-base font-semibold mb-4 tracking-wide pl-2">
                            Produtos
                        </h3>
                        <ul className="space-y-2 text-primary text-xs">
                            <li>
                                <Link
                                    href="#"
                                    className="inline-block hover:text-primary2 transition-transform duration-300 ease-in-out  hover:shadow-lg tracking-wide hover:shadow-secondary p-2 rounded-lg hover:scale-105 focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    Lingerie
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="inline-block hover:text-primary2 transition-transform duration-300 ease-in-out  hover:shadow-lg tracking-wide hover:shadow-secondary p-2 rounded-lg hover:scale-105 focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    Pijamas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="inline-block hover:text-primary2 transition-transform duration-300 ease-in-out  hover:shadow-lg tracking-wide hover:shadow-secondary p-2 rounded-lg hover:scale-105 focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    Cosméticos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="inline-block hover:text-primary2 transition-transform duration-300 ease-in-out  hover:shadow-lg tracking-wide hover:shadow-secondary p-2 rounded-lg hover:scale-105 focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    Para o meu Boy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="inline-block hover:text-primary2 transition-transform duration-300 ease-in-out  hover:shadow-lg tracking-wide hover:shadow-secondary p-2 rounded-lg hover:scale-105 focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    Perfumes
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:justify-self-end">
                        <h3 className="text-base font-semibold mb-4 tracking-wide pl-2">
                            Stylos
                        </h3>
                        <ul className="space-y-2 text-primary text-xs ">
                            <li className=" ">
                                <Link
                                    href="/quem-somos"
                                    className="inline-block hover:text-primary2 transition-transform duration-300 ease-in-out  hover:shadow-lg tracking-wide hover:shadow-secondary p-2 rounded-lg hover:scale-105 focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    Quem somos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/quem-somos#historia"
                                    className="inline-block hover:text-primary2 transition-transform duration-300 ease-in-out  hover:shadow-lg tracking-wide hover:shadow-secondary p-2 rounded-lg hover:scale-105 focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    Nossa História
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/quem-somos"
                                    className="inline-block hover:text-primary2 transition-transform duration-300 ease-in-out  hover:shadow-lg tracking-wide hover:shadow-secondary p-2 rounded-lg hover:scale-105 focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    Termos e Condições
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/quem-somos"
                                    className="inline-block hover:text-primary2 transition-transform duration-300 ease-in-out  hover:shadow-lg tracking-wide hover:shadow-secondary p-2 rounded-lg hover:scale-105 focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    Entregas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/quem-somos"
                                    className="inline-block hover:text-primary2 transition-transform duration-300 ease-in-out  hover:shadow-lg tracking-wide hover:shadow-secondary p-2 rounded-lg hover:scale-105 focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    Pagamentos Seguros
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col justify-center align-center border border-light2 rounded p-4 mt-4 w-min mx-auto">
                    <h3 className="text-white-important flex justify-center items-center text-sm p-4 gap-4 whitespace-nowrap">
                        <BsLockFill className="text-white mr-2 " />
                        Pagamento Seguro com Mercado Pago
                        <SiMercadopago className="text-white w-12 h-12" />
                    </h3>
                    <div className="flex gap-8 text-[9px] text-primary justify-center align-center mt-2">
                        <div className="flex flex-col justify-center items-center">
                            <MdPix size={15} className="text-white-important" />
                            <p className="mt-2 text-center">Pix</p>
                        </div>

                        <div className="flex flex-col justify-center items-center">
                            <BsCreditCard className="text-white w-6 h-6" />
                            <p className="mt-1 text-center">Débito</p>
                        </div>

                        <div className="flex flex-col justify-center items-center">
                            <CiCreditCard1 className="text-white w-6 h-6" />
                            <p className="mt-1 text-center">Crédito</p>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <CiBank className="text-white w-6 h-6" />
                            <p className="mt-1 text-center">Boleto</p>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <RiVisaLine className="text-white w-6 h-6" />
                            <p className="mt-1 text-center">Visa</p>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <RiMastercardLine className="text-white w-6 h-6" />
                            <p className="mt-1 text-center">Mastercard</p>
                        </div>
                    </div>
                </div>
            </div>
            <Link
                className="text-[#ebe8e8] text-xs flex justify-center align-center "
                href="https://www.wbdigitalsolutions.com/"
                target="_blank"
            >
                <p className="text-[9px] mt-4 mb-4">
                    Copyright © WB Digital Solutions
                </p>
            </Link>
        </footer>
    );
};

export default Footer;
