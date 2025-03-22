'use client';
import Image from 'next/image';
import Link from 'next/link';

import Container from '@/components/Container';
import Sidebar from '@/components/SideBar';
import ProductList from '@/components/ProductList';
import { ImagesSlider } from '@/components/ui/images-slider';
import { useEffect, useRef, useState } from 'react';
import Loader from '@/components/Loader';
import CookieConsent from '@/components/AcceptCookies';

type SidebarRef = HTMLDivElement | null;

const Home = () => {
    const sidebarRef = useRef<SidebarRef>(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleSidebarMount = () => {
        if (sidebarRef.current) {
            console.log('Sidebar montada:', sidebarRef.current);
        }
    };

    useEffect(() => {
        setIsLoading(false);
    }, []);

    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center h-screen">
                    <Loader />
                </div>
            ) : (
                <Container>
                    <div className="w-full max-w-full">
                        <ImagesSlider
                            className="w-full max-w-full h-[20rem]"
                            images={[
                                '/images/hero1.jpg',
                                '/images/hero2.jpg',
                                '/images/hero3.jpg',
                            ]}
                            autoplay={true}
                            direction="up"
                        >
                            <div className="z-10  bg-primaryLight/[.7] p-4  rounded-lg">
                                <h1 className="text-primaryDark text-xl md:text-4xl font-extrabold pb-2">
                                    Agora também na internet.
                                </h1>
                                <p className="text-sm md:text-xl text-secondary font-bold">
                                    Faça o seu pedido que entregamos na sua
                                    casa.
                                </p>
                            </div>
                        </ImagesSlider>
                        <CookieConsent />
                    </div>
                    <div className="max-w-7xl  mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
                            <div className="flex rounded-md border border-light hover:scale-105 hover:shadow-lg p-2 bg-primaryLight  z-10 transition duration-300 ease-in-out">
                                <div className="flex ">
                                    <Image
                                        src="/icons/lingerie-mini.svg"
                                        alt="icone de lingerie"
                                        width={100}
                                        height={100}
                                        className="object-contain"
                                    />
                                </div>

                                <Link
                                    href={`/filtered?category=0e531727-94ac-4620-b64f-188063b4e572`}
                                    className="text-xs font-regular uppercase pl-2 self-center "
                                >
                                    Lingeries
                                    <p className="text-secondary  text-[11px] capitalize font-normal ">
                                        Mostrar Todas
                                    </p>
                                </Link>
                            </div>

                            <div className="flex rounded-md border border-light hover:scale-105 hover:shadow-lg p-2 bg-primaryLight z-10 transition duration-300 ease-in-out">
                                <div className="flex ">
                                    <Image
                                        src="/icons/pijamas.svg"
                                        alt="icone de lingerie"
                                        width={50}
                                        height={50}
                                    />
                                </div>

                                <Link
                                    href={`/filtered?category=8cb20bbc-b693-42b9-8cfe-8c7da3036772`}
                                    className="text-xs font-regular uppercase pl-2 self-center "
                                >
                                    Pijamas
                                    <p className="text-secondary text-[11px] capitalize font-normal">
                                        Mostrar Todas
                                    </p>
                                </Link>
                            </div>

                            <div className="flex rounded-md border border-light hover:scale-105 hover:shadow-lg p-2 bg-primaryLight  z-10 transition duration-300 ease-in-out">
                                <div className="flex text-primaryDark ">
                                    <Image
                                        src="/icons/boy.svg"
                                        alt="icone de lingerie"
                                        width={50}
                                        height={50}
                                    />
                                </div>

                                <Link
                                    href={`filtered?category=8937d517-7071-4d09-94b9-9306853a7a5f`}
                                    className="text-xs font-regular uppercase pl-2 self-center"
                                >
                                    Para o seu Boy
                                    <p className="text-secondary text-[11px] capitalize font-normal">
                                        Mostrar Todas
                                    </p>
                                </Link>
                            </div>

                            <div className="flex rounded-md border border-light hover:scale-105 hover:shadow-lg p-2 bg-primaryLight  z-10 transition duration-300 ease-in-out">
                                <div className="flex">
                                    <Image
                                        src="/icons/acessorios.svg"
                                        alt="icone de lingerie"
                                        width={50}
                                        height={50}
                                    />
                                </div>

                                <Link
                                    href={`/filtered?category=cff1bf1b-93c5-44d5-9cf4-c6a2bd40b555`}
                                    className="text-xs font-regular uppercase pl-2 self-center"
                                >
                                    Acessórios{' '}
                                    <span className="text-[11px] text-fontColor font-light">
                                        (22)
                                    </span>
                                    <p className="text-secondary text-[11px] capitalize font-normal">
                                        Mostrar Todas
                                    </p>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                        <div className="md:col-span-1">
                            <Sidebar />
                        </div>

                        <div className="md:col-span-3">
                            <ProductList />
                        </div>
                    </section>
                </Container>
            )}
        </>
    );
};

export default Home;
