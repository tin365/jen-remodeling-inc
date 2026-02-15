const repo = 'jen-remodeling-inc'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // GitHub Pages: https://tin365.github.io/jen-remodeling-inc/
  basePath: process.env.NODE_ENV === 'production' ? `/${repo}` : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? `/${repo}/` : '',
  output: 'export',
  trailingSlash: true,
}

module.exports = nextConfig

