'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ShoppingBag, Heart, Award, Truck, Star } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const WhoWeAre = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useGSAP(() => {
        if (
            typeof window === 'undefined' ||
            !sectionRef.current ||
            !containerRef.current
        )
            return;

        const slides = gsap.utils.toArray<HTMLElement>('.slide');

        // Create the horizontal scroll animation
        gsap.to(slides, {
            xPercent: -100 * (slides.length - 1),
            ease: 'none',
            scrollTrigger: {
                trigger: sectionRef.current,
                pin: true,
                scrub: 1,
                snap: 1 / (slides.length - 1),
                end: () => `+=${sectionRef.current?.offsetWidth || 0}`,
            },
        });

        // Animate headings with useGSAP
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
                        },
                    }
                );
            }
        });

        // Progress bar animation
        gsap.to('.progress', {
            scaleX: 1,
            transformOrigin: 'left center',
            ease: 'none',
            scrollTrigger: {
                trigger: sectionRef.current,
                scrub: 0.3,
                start: 'top top',
                end: 'bottom bottom',
            },
        });

        // Cleanup function
        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

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
                <h1 className="text-6xl font-bold text-center tracking-tight text-white">
                    Conheça Nossa História <br />
                    Nossa Jornada
                </h1>
                {/* adcione aqui uma fecha moderna animada para informar para descer. */}
            </header>

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
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-6">Our Story</h2>
                        <p className="text-gray-600 mb-12">
                            Founded in 2020, we're passionate about creating
                            lingerie that makes every woman feel beautiful and
                            confident. Our designs combine timeless elegance
                            with modern comfort, using only the finest materials
                            and expert craftsmanship.
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

            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-12 text-center">
                        What Our Customers Say
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="p-6 bg-neutral-50 rounded-lg"
                            >
                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map(
                                        (_, i) => (
                                            <Star
                                                key={i}
                                                className="w-5 h-5 text-yellow-400 fill-current"
                                            />
                                        )
                                    )}
                                </div>
                                <p className="text-gray-600 mb-4">
                                    "{testimonial.comment}"
                                </p>
                                <p className="font-semibold">
                                    {testimonial.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-rose-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-6">
                            Join Our Community
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Subscribe to receive updates about new collections,
                            special offers, and styling tips.
                        </p>
                        <div className="flex gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                            <button className="bg-rose-500 text-white px-8 py-3 rounded-full hover:bg-rose-600 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-rose-600 text-white grid place-content-center h-[80vh]">
                <div className="text-center px-4">
                    <h2 className="text-4xl font-bold mb-4">Nossa Missão</h2>
                    <p className="max-w-2xl">
                        Proporcionar conforto, confiança e beleza através de
                        peças únicas, feitas com paixão e dedicação para todas
                        as mulheres.
                    </p>
                </div>
            </footer>

            <div className="progress fixed left-4 right-4 h-2 rounded-full bg-rose-600 bottom-8" />
        </div>
    );
};

export default WhoWeAre;
