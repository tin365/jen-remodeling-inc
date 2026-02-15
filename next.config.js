/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // For GitHub Pages deployment (https://tin365.github.io/jen-remodeling-inc/)
  basePath: process.env.NODE_ENV === 'production' ? '/jen-remodeling-inc' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://tin365.github.io/jen-remodeling-inc' : '',
  output: 'export', // Static export for GitHub Pages
  trailingSlash: true,
}

module.exports = nextConfig
