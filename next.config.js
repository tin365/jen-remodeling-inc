const repo = 'jen-remodeling-inc'
const basePath = process.env.NODE_ENV === 'production' ? `/${repo}` : ''
// Path-only: assets load from current origin. Requires .nojekyll so GitHub Pages serves _next/
const assetPrefix = basePath ? `${basePath}/` : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
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
  basePath,
  assetPrefix,
  output: 'export',
  trailingSlash: true,
}

module.exports = nextConfig
