/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/photos/**',
      },
    ],
  },
  // Required for Docker setup
  output: 'standalone',
  
  // API proxy configuration
  async rewrites() {
    return [
      {
        source: '/api/fhir/:path*',
        destination: 'http://172.17.0.3:8080/fhir/:path*'
      }
    ]
  }
}

module.exports = nextConfig
