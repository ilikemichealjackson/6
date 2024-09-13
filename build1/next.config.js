/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Enables SWC minification for faster builds
  images: {
    domains: ['your-image-domain.com'], // Add allowed image domains if using remote images
  },
};

module.exports = nextConfig;
