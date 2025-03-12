'use client';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState, useCallback } from 'react';

export const ImagesSlider = ({
    images,
    children,
    overlay = true,
    overlayClassName,
    className,

    autoplay = true,
    direction = 'up',
}: {
    images: string[];
    children?: React.ReactNode;
    overlay?: boolean;
    overlayClassName?: string;
    className?: string;

    autoplay?: boolean;
    direction?: 'up' | 'down';
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>(
        {}
    );

    const handleNext = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex + 1 === images.length ? 0 : prevIndex + 1
        );
    }, [images.length]);

    const handlePrevious = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
        );
    }, [images.length]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight') {
                handleNext();
            } else if (event.key === 'ArrowLeft') {
                handlePrevious();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        let interval: any;
        if (autoplay) {
            interval = setInterval(() => {
                handleNext();
            }, 5000);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearInterval(interval);
        };
    }, [autoplay, handleNext, handlePrevious]);

    useEffect(() => {
        if (!imageLoaded[currentIndex]) {
            setImageLoaded((prev) => ({
                ...prev,
                [currentIndex]: true,
            }));
        }
    }, [currentIndex, imageLoaded]);

    const slideVariants = {
        initial: {
            scale: 0,
            opacity: 0,
            rotateX: 45,
        },

        visible: {
            scale: 1,
            rotateX: 0,
            opacity: 1,
            transition: {
                duration: 1,
                ease: [0.645, 0.045, 0.355, 1.0],
            },
        },
        upExit: {
            opacity: 1,
            y: '-150%',
            transition: {
                duration: 1,
            },
        },
        downExit: {
            opacity: 1,
            y: '150%',
            transition: {
                duration: 1,
            },
        },
    };

    return (
        <div
            className={cn(
                'overflow-hidden w-full relative flex items-center justify-center',
                className
            )}
            style={{
                perspective: '1000px',
            }}
        >
            {children}
            {overlay && (
                <div
                    className={cn(
                        'absolute inset-0 bg-black/20 z-40',
                        overlayClassName
                    )}
                />
            )}

            <AnimatePresence>
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    initial="initial"
                    animate="visible"
                    exit={direction === 'up' ? 'upExit' : 'downExit'}
                    variants={slideVariants}
                    className={cn(
                        'image absolute inset-0 w-full h-full object-cover object-center',
                        !imageLoaded[currentIndex] && 'blur-effect'
                    )}
                    onLoad={() => {
                        setImageLoaded((prev) => ({
                            ...prev,
                            [currentIndex]: true,
                        }));
                    }}
                    onError={() => {
                        setImageLoaded((prev) => ({
                            ...prev,
                            [currentIndex]: true,
                        }));
                    }}
                />
            </AnimatePresence>
        </div>
    );
};
