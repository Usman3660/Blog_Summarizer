/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongodb', 'cheerio']
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['placeholder.svg'],
    unoptimized: true,
  },
}

export default nextConfig
