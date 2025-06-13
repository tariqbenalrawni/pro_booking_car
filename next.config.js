/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  experimental: {
    optimizePackageImports: ['@mui/material'],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
}

module.exports = nextConfig
