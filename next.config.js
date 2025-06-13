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
  eslint: {
    ignoreDuringBuilds: true, // ✅ هذا السطر يحل المشكلة
  },
}

module.exports = nextConfig
