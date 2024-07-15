'use client';
import { useEffect, useState } from 'react';
import { BsInstagram, BsFacebook, BsTiktok } from 'react-icons/bs';

export const SocialIcons = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div>
            <div className="social-icons flex gap-3">
                <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <BsInstagram className="rounded bg-primaryLight dark:bg-primaryLight  text-secondary dark:text-primaryDark transition duration-300 hover:scale-125" />
                </a>
                <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <BsFacebook className="rounded  bg-primaryLight dark:bg-primaryLight  text-secondary dark:text-primaryDark transition duration-300 hover:scale-125" />
                </a>
                <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <BsTiktok className="rounded  bg-primaryLight dark:bg-primaryLight   text-secondary dark:text-primaryDark transition duration-300 hover:scale-125" />
                </a>
            </div>
        </div>
    );
};
