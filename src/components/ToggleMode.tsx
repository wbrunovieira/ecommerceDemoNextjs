'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { ButtonShadcn } from './ui/button';

const ToggleMode = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const dark = theme === 'dark';

    return (
        <ButtonShadcn
            variant="outline"
            size="icon"
            onClick={() => setTheme(`${dark ? 'light' : 'dark'}`)}
        >
            {dark ? (
                <Sun className="hover:cursor-pointer text-primary2 hover:text-primary" />
            ) : (
                <Moon className="hover:cursor-pointer text-primary2 hover:text-primary" />
            )}
        </ButtonShadcn>
    );
};

export default ToggleMode;
