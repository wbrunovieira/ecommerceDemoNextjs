import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      primary: '#F0B1CC',
      secondary: '#D3686C',
      primaryDark: '#540002',
      fontColor: '#333333',
    },
  },
  plugins: [],
};
export default config;
