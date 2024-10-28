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
                'linear-gradient':
                    'linear-gradient(135deg,#F0B1CC 2%, #f3d4e0 15%, #ffffff 85%, #f3d4e0 95%, #F0B1CC 100%)',
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
                circle: {
                    '0%': {
                        top: '60px',
                        height: '5px',
                        borderRadius: '50px 50px 25px 25px',
                        transform: 'scaleX(1.7)',
                    },
                    '40%': {
                        height: '20px',
                        borderRadius: '50%',
                        transform: 'scaleX(1)',
                    },
                    '100%': { top: '0%' },
                },
                shadow: {
                    '0%': { transform: 'scaleX(1.5)', opacity: '1' },
                    '40%': { transform: 'scaleX(1)', opacity: '0.7' },
                    '100%': { transform: 'scaleX(0.2)', opacity: '0.4' },
                },
            },

            animation: {
                accordionDown: 'accordion-down 0.2s ease-out',
                accordionUp: 'accordion-up 0.2s ease-out',
                spotlight: 'spotlight 2s ease .75s 1 forwards',
                circle: 'circle 0.5s alternate infinite ease',
                shadow: 'shadow 0.5s alternate infinite ease',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};

export default config;
