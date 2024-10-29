'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
    Heart,
    Award,
    Truck,
    Star,
    ChevronDown,
    Users,
    Target,
    Sparkles,
} from 'lucide-react';
import RandomNumber from '@/components/RandomNumber';

interface Slide {
    title: string;
    bgColor: string;
    textColor: string;
    description: string;
}

const WhoWeAreContent = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    if (typeof window !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined') {
                ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            }
        };
    }, []);

    useGSAP(() => {
        if (!isMounted || typeof window === 'undefined' || !sectionRef.current)
            return;

        const slides = gsap.utils.toArray<HTMLElement>('.slide');
        if (slides.length === 0) return;

        // Reset any existing ScrollTriggers
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

        // Scroll arrow animation
        gsap.to('.scroll-arrow', {
            y: 20,
            repeat: -1,
            yoyo: true,
            duration: 1.5,
            ease: 'power1.inOut',
        });

        // Calculate the end position safely
        const getEndPosition = () => {
            if (!sectionRef.current) return '+=0';
            return `+=${sectionRef.current.offsetWidth}`;
        };

        // Horizontal scroll animation
        const horizontalScrollTrigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            snap: 1 / (slides.length - 1),
            end: getEndPosition,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                // Handle scroll progress
                if (slides.length > 1) {
                    gsap.to(slides, {
                        xPercent: -100 * (slides.length - 1) * self.progress,
                        ease: 'none',
                    });
                }
            },
        });

        // Heading animations
        slides.forEach((slide) => {
            const heading = slide.querySelector('h2');
            if (heading) {
                gsap.fromTo(
                    heading,
                    { x: 100, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        scrollTrigger: {
                            trigger: slide,
                            start: 'left center',
                            end: 'right center',
                            scrub: true,
                            invalidateOnRefresh: true,
                        },
                    }
                );
            }
        });

        // Handle resize events
        const handleResize = () => {
            ScrollTrigger.refresh();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            horizontalScrollTrigger.kill();
            window.removeEventListener('resize', handleResize);
        };
    }, [isMounted]);

    const slides = [
        {
            title: 'PAIXÃO',
            bgColor: 'bg-darkPrimary',
            textColor: 'text-primaryLight',
            description: 'Nossa paixão por criar peças únicas',
        },
        {
            title: 'QUALIDADE',
            bgColor: 'bg-primaryDark',
            textColor: 'text-primaryLight',
            description: 'Materiais premium e acabamento perfeito',
        },
        {
            title: 'CONFORTO',
            bgColor: 'bg-secondary',
            textColor: 'text-primaryLight',
            description: 'Conforto em cada detalhe',
        },
        {
            title: 'ESTILO',
            bgColor: 'bg-primary2',
            textColor: 'text-rose-950',
            description: 'Design moderno e atemporal',
        },
        {
            title: 'CONFIANÇA',
            bgColor: 'bg-primary',
            textColor: 'text-white',
            description: 'Empoderamento através da beleza',
        },
    ];

    const numbers = [
        {
            number: '10k+',
            label: 'Clientes Satisfeitas',
        },
        {
            number: '1.5k+',
            label: 'Produtos Vendidos/Mês',
        },
        {
            number: '98%',
            label: 'Avaliações Positivas',
        },
        {
            number: '24h',
            label: 'Atendimento',
        },
    ];

    const values = [
        {
            icon: <Users className="w-8 h-8" />,
            title: 'Diversidade',
            description: 'Celebramos a beleza em todas as suas formas',
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: 'Sustentabilidade',
            description: 'Comprometimento com práticas sustentáveis',
        },
        {
            icon: <Sparkles className="w-8 h-8" />,
            title: 'Inovação',
            description: 'Sempre buscando as últimas tendências',
        },
    ];

    const testimonials = [
        {
            name: 'Sarah M.',
            comment:
                "The quality and fit are perfect. Best lingerie I've ever owned!",
            rating: 5,
        },
        {
            name: 'Emily R.',
            comment: 'Amazing customer service and beautiful products.',
            rating: 5,
        },
    ];

    const benefits = [
        {
            icon: <Heart className="w-6 h-6" />,
            title: 'Quality & Comfort',
            description: 'Carefully selected materials for ultimate comfort',
        },
        {
            icon: <Award className="w-6 h-6" />,
            title: 'Expert Design',
            description: 'Created by experienced fashion designers',
        },
        {
            icon: <Truck className="w-6 h-6" />,
            title: 'Fast Delivery',
            description: 'Free shipping on orders over $100',
        },
    ];

    if (!isMounted) return null;

    return (
        <div className="relative overflow-hidden">
            <header className="relative w-full bg-primaryDark grid place-content-center h-[80vh]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                <div className="text-center">
                    <h1 className="text-6xl font-bold tracking-tight text-white mb-8">
                        Conheça Nossa História <br />
                        Nossa Essência
                    </h1>
                    <ChevronDown className="scroll-arrow w-8 h-8 text-white mx-auto animate-bounce" />
                </div>
            </header>

            <RandomNumber />

            <section ref={sectionRef} className="relative h-[100vh]">
                <div
                    ref={containerRef}
                    className="sticky top-0 flex h-screen overflow-hidden"
                >
                    {slides.map((slide, index) => (
                        <div
                            key={slide.title}
                            className={`slide flex-none w-screen h-screen ${slide.bgColor} flex flex-col justify-center items-center relative`}
                        >
                            <div className="text-center px-4">
                                <h2
                                    className={`text-[15vw] font-bold ${slide.textColor} mb-4`}
                                >
                                    {slide.title}
                                </h2>
                                <p
                                    className={`text-xl ${slide.textColor} max-w-md mx-auto`}
                                >
                                    {slide.description}
                                </p>
                            </div>
                            <div className="relative w-[380px] 2xl:w-[550px] aspect-square">
                                <Image
                                    src="/images/store/loja-1.jpeg"
                                    fill
                                    alt={`Imagem de ${slide.title.toLowerCase()}`}
                                    className="object-cover"
                                    sizes="(max-width: 1536px) 380px, 550px"
                                    priority={index === 0}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>


            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-12">
                        Nossos Valores
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="text-center p-6 bg-neutral-50 rounded-lg hover:shadow-lg transition-shadow"
                            >
                                <div className="text-rose-500 mb-4 flex justify-center">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-6">
                            Nossa História
                        </h2>
                        <p className="text-gray-600 mb-12">
                            Desde 2020, nos dedicamos a criar lingeries que
                            fazem toda mulher se sentir linda e confiante.
                            Nossas peças combinam elegância atemporal com
                            conforto moderno, utilizando os melhores materiais e
                            acabamento artesanal de alta qualidade.
                        </p>
                        <div className="grid md:grid-cols-3 gap-8">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="p-6 bg-neutral-50 rounded-lg"
                                >
                                    <div className="text-rose-500 mb-4">
                                        {benefit.icon}
                                    </div>
                                    <h3 className="font-semibold mb-2">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {benefit.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/store/loja-2.jpeg"
                        alt="Background"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50" />
                </div>
                <div className="container mx-auto px-6 relative">
                    <div className="max-w-2xl mx-auto text-center text-white">
                        <h2 className="text-4xl font-bold mb-6">
                            Fique Por Dentro das Novidades
                        </h2>
                        <p className="mb-8">
                            Receba em primeira mão nossas ofertas exclusivas,
                            lançamentos e dicas de moda íntima.
                        </p>
                        <div className="flex gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Digite seu email"
                                className="flex-1 px-4 py-3 rounded-full border border-white bg-transparent text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                            />
                            <button className="bg-white text-rose-500 px-8 py-3 rounded-full hover:bg-rose-100 transition-colors">
                                Inscrever
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white overflow-hidden">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-12 text-center">
                        O Que Nossas Clientes Dizem
                    </h2>
                    <div className="relative">
                        <div
                            className="transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${
                                    currentTestimonial * 100
                                }%)`,
                            }}
                        >
                            <div className="flex">
                                {testimonials.map((testimonial, index) => (
                                    <div
                                        key={index}
                                        className="flex-none w-full px-4"
                                    >
                                        <div className="max-w-2xl mx-auto p-6 bg-neutral-50 rounded-lg">
                                            <div className="flex mb-4">
                                                {[
                                                    ...Array(
                                                        testimonial.rating
                                                    ),
                                                ].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="w-5 h-5 text-yellow-400 fill-current"
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-gray-600 mb-4">
                                                "{testimonial.comment}"
                                            </p>
                                            <p className="font-semibold">
                                                {testimonial.name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center mt-6 gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${
                                        currentTestimonial === index
                                            ? 'bg-rose-500'
                                            : 'bg-gray-300'
                                    }`}
                                    onClick={() => setCurrentTestimonial(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-darkSecondary text-white grid place-content-center h-[80vh]">
                <div className="text-center px-4">
                    <h2 className="text-4xl font-bold mb-4">Nossa Missão</h2>
                    <p className="max-w-2xl">
                        Transformar a experiência de compra de lingerie,
                        oferecendo peças que combinam conforto, qualidade e
                        beleza, valorizando a autoestima de cada mulher.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default WhoWeAreContent;
