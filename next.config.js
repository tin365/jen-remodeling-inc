const repo = 'jen-remodeling-inc'
const assetPrefix = `/${repo}/`
const basePath = `/${repo}`

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // For GitHub Pages deployment (https://tin365.github.io/jen-remodeling-inc/)
  assetPrefix: assetPrefix,
  basePath: basePath,
  output: 'export', // Static export for GitHub Pages
  trailingSlash: true,
}

module.exports = nextConfig
