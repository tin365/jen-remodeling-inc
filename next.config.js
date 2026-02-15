const repo = 'jen-remodeling-inc'
const base = process.env.NODE_ENV === 'production' ? `https://tin365.github.io/${repo}` : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  basePath: process.env.NODE_ENV === 'production' ? `/${repo}` : '',
  assetPrefix: base ? `${base}/` : '',
  output: 'export',
  trailingSlash: true,
}

module.exports = nextConfig
