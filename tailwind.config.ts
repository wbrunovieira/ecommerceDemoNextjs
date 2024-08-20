import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            colors: {
                primary: '#F0B1CC',
                primary2: '#c73e89',
                primaryLight: '#fcf3f7',
                secondary: '#D3686C',
                primaryDark: '#540002',
                fontColor: '#333333',
                redAtention: '#EB312C',
                darkBackground: '#1a1a1a',
                darkPrimary: '#a63955',
                darkSecondary: '#7c3d3d',
                darkFontColor: '#e4e4e4',
            },
            backgroundImage: {
                'header-bg': "url('/images/banner6.svg')",
                'header-bg-dark': "url('/images/banner6dark.svg')",
                'dark-secondary-gradient':
                    'linear-gradient(45deg, #7c3d3d, #4b2c2c)',
            },
            keyframes: {
                accordionDown: {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                accordionUp: {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                spotlight: {
                    '0%': {
                        opacity: '0',
                        transform: 'translate(-72%, -62%) scale(0.5)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translate(-50%, -40%) scale(1)',
                    },
                },
            },
            animation: {
                accordionDown: 'accordion-down 0.2s ease-out',
                accordionUp: 'accordion-up 0.2s ease-out',
                spotlight: 'spotlight 2s ease .75s 1 forwards',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};

export default config;
