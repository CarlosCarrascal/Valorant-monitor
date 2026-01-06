/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://votations.rastry.com/api/:path*',
            },
        ];
    },
};

export default nextConfig;