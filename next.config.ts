/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'r2.comfy.icu',
        port: '',
        pathname: '/workflows/**',
      },
    ],
  },
};

module.exports = nextConfig;
