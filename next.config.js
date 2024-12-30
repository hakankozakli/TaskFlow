/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true }
};

const withNextIntl = require('next-intl/plugin')();

module.exports = withNextIntl(nextConfig);