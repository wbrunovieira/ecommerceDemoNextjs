'use client';
import { useEffect, useState } from 'react';
import { BsInstagram, BsFacebook, BsTiktok } from 'react-icons/bs';

interface SocialIconsProps {
    className?: string;
}

export const SocialIcons = ({ className }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div>
            <div className={className}>
                <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <BsInstagram className="text-sm md:text-base lg:text-lg rounded bg-primaryLight Light text-primary2  transition duration-300 hover:scale-110 md:hover:scale-125" />
                </a>
                <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <BsFacebook className="text-sm md:text-base lg:text-lg rounded  bg-primaryLight Light text-primary2  transition duration-300 hover:scale-110 md:hover:scale-125" />
                </a>
                <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <BsTiktok className="text-sm md:text-base lg:text-lg rounded  bg-primaryLight Light  text-primary2  transition duration-300 hover:scale-110 md:hover:scale-125" />
                </a>
            </div>
        </div>
    );
};
