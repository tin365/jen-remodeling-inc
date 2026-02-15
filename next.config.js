const repo = 'jen-remodeling-inc'
const basePath = process.env.NODE_ENV === 'production' ? `/${repo}` : ''
// Path-only prefix so assets load from current origin (works on GH Pages and local preview)
const assetPrefix = basePath ? `${basePath}/` : ''

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
  basePath,
  assetPrefix,
  output: 'export',
  trailingSlash: true,
}

module.exports = nextConfig
