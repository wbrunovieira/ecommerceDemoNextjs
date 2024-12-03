const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com', 'cdn.connectplug.com.br'],
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
    async headers() {
        return [
            {
                source: '/(.*).(js|css|png|jpg|svg)',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                    { key: 'Content-Type', value: 'application/javascript' }, 
                ],
            },
        ];
    },
};

module.exports = nextConfig;
