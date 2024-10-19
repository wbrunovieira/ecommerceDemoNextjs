
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
};

module.exports = nextConfig;
